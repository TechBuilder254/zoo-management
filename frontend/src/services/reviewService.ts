import { supabase } from '../config/supabase';
import { Review, ReviewFormData, ReviewStatus } from '../types';
import { PaginationParams } from '../types/pagination';

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export const reviewService = {
  getByAnimalId: async (animalId: string): Promise<Review[]> => {
    try {
      // Get current user to show their pending reviews
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('reviews')
        .select(`
          *,
          users!reviews_user_id_fkey (
            id,
            name,
            email
          )
        `)
        .eq('animal_id', animalId)
        .order('created_at', { ascending: false });

      // If user is logged in, show approved reviews + their own pending reviews
      if (user) {
        query = query.or(`status.eq.APPROVED,and(status.eq.PENDING,user_id.eq.${user.id})`);
      } else {
        // If not logged in, only show approved reviews
        query = query.eq('status', 'APPROVED');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in reviewService.getByAnimalId:', error);
      return [];
    }
  },

  create: async (data: ReviewFormData & { isAnonymous?: boolean }): Promise<Review> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (!data.animalId) {
        throw new Error('Animal ID is required');
      }

      // First, ensure user exists in custom users table
      const { error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (userError && userError.code === 'PGRST116') {
        // User doesn't exist in custom users table, create them
        console.log('Creating user in custom users table:', user.id);
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              email: user.email || '',
              password: 'supabase_auth_user', // Placeholder since Supabase handles auth
              name: user.user_metadata?.name || user.email || 'User',
              role: user.user_metadata?.role || 'VISITOR',
              created_at: user.created_at || new Date().toISOString(),
              updated_at: user.updated_at || new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          throw new Error(`Failed to create user: ${createError.message}`);
        }
        console.log('User created successfully:', newUser.id);
      } else if (userError) {
        console.error('Error checking user:', userError);
        throw new Error(`Failed to check user: ${userError.message}`);
      }

      // Now create the review
      const { data: result, error } = await supabase
        .from('reviews')
        .insert([{
          user_id: user.id,
          animal_id: data.animalId,
          rating: data.rating,
          comment: data.comment,
          status: 'PENDING', // Reviews need approval before being public
          is_anonymous: !!data.isAnonymous,
        }])
        .select(`
          *,
          users!reviews_user_id_fkey (
            id,
            name,
            email
          )
        `)
        .single();

      if (error) {
        console.error('Error creating review:', error);
        throw new Error(`Failed to create review: ${error.message}`);
      }

      return result as Review;
    } catch (error) {
      console.error('Error in reviewService.create:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Unexpected error: ${JSON.stringify(error)}`);
      }
    }
  },

  update: async (id: string, data: Partial<ReviewFormData>): Promise<Review> => {
    try {
      const updateData: any = {};
      
      if (data.rating) updateData.rating = data.rating;
      if (data.comment) updateData.comment = data.comment;

      const { data: result, error } = await supabase
        .from('reviews')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          users!reviews_user_id_fkey (
            id,
            name,
            email
          )
        `)
        .single();

      if (error) {
        console.error('Error updating review:', error);
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Error in reviewService.update:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting review:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in reviewService.delete:', error);
      throw error;
    }
  },

  moderate: async (id: string, status: ReviewStatus): Promise<Review> => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', id)
        .select(`
          *,
          users!reviews_user_id_fkey (
            id,
            name,
            email
          )
        `)
        .single();

      if (error) {
        console.error('Error moderating review:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in reviewService.moderate:', error);
      throw error;
    }
  },

  markAsHelpful: async (id: string): Promise<Review> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Add helpful vote
      const { error: voteError } = await supabase
        .from('review_helpful_votes')
        .insert([{
          review_id: id,
          user_id: user.id
        }]);

      if (voteError && !voteError.message.includes('duplicate')) {
        console.error('Error marking review as helpful:', voteError);
        throw voteError;
      }

      // Get updated review
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users!reviews_user_id_fkey (
            id,
            name,
            email
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching updated review:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in reviewService.markAsHelpful:', error);
      throw error;
    }
  },

  getAll: async (params?: PaginationParams & { status?: string; sentiment?: string }): Promise<ReviewsResponse> => {
    try {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          users!reviews_user_id_fkey (
            id,
            name,
            email
          )
        `, { count: 'exact' });

      // Apply filters
      if (params?.status) {
        query = query.eq('status', params.status);
      }

      if (params?.sentiment) {
        query = query.eq('sentiment', params.sentiment);
      }

      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 12;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        reviews: data || [],
        total: count || 0,
        page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };
    } catch (error) {
      console.error('Error in reviewService.getAll:', error);
      return {
        reviews: [],
        total: 0,
        page: 1,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      };
    }
  },
};






