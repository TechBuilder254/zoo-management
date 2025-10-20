import { supabase } from '../config/supabase';
import { Animal, AnimalFormData, AnimalType, ConservationStatus } from '../types/animal';

export interface AnimalFilters {
  search?: string;
  type?: AnimalType;
  conservationStatus?: ConservationStatus;
  sortBy?: 'name' | 'age' | 'popularity';
  page?: number;
  limit?: number;
}

export interface AnimalsResponse {
  animals: Animal[];
  total: number;
  page: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export const animalService = {
  getAll: async (filters?: AnimalFilters): Promise<AnimalsResponse> => {
    try {
      let query = supabase
        .from('animals')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,species.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      if (filters?.type) {
        query = query.eq('category', filters.type);
      }

      if (filters?.conservationStatus) {
        query = query.eq('conservation_status', filters.conservationStatus);
      }

      // Apply sorting
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case 'name':
            query = query.order('name', { ascending: true });
            break;
          case 'age':
            query = query.order('age', { ascending: false });
            break;
          case 'popularity':
            query = query.order('view_count', { ascending: false });
            break;
        }
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 12;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching animals:', error);
        throw error;
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        animals: data || [],
        total: count || 0,
        page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };
    } catch (error) {
      console.error('Error in animalService.getAll:', error);
      return {
        animals: [],
        total: 0,
        page: 1,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      };
    }
  },

  getById: async (id: string): Promise<Animal> => {
    try {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching animal:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in animalService.getById:', error);
      throw error;
    }
  },

  create: async (data: AnimalFormData, _photos?: File[]): Promise<Animal> => {
    try {
      console.log('Creating animal with data:', data); // Debug log
      
      const { data: result, error } = await supabase
        .from('animals')
        .insert([{
          name: data.name,
          species: data.species,
          category: data.type || data.category, // Support both field names
          description: data.description,
          habitat: data.habitat,
          diet: data.diet || null, // Optional field
          image_url: data.imageUrl || data.image_url || null, // Support both field names
          lifespan: data.lifespan || null, // Optional field
          status: data.status || 'ACTIVE'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating animal:', error);
        console.error('Error details:', error.message, error.details, error.hint);
        throw error;
      }

      console.log('Animal created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in animalService.create:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<AnimalFormData>): Promise<Animal> => {
    try {
      const updateData: any = {};
      
      if (data.name) updateData.name = data.name;
      if (data.species) updateData.species = data.species;
      if (data.type) updateData.category = data.type;
      if (data.description) updateData.description = data.description;
      if (data.diet) updateData.diet = data.diet;
      if (data.lifespan) updateData.lifespan = data.lifespan;
      if (data.conservationStatus) updateData.conservation_status = data.conservationStatus;
      if (data.interestingFacts) updateData.interesting_facts = data.interestingFacts;
      if (data.habitat) updateData.habitat = data.habitat;

      const { data: result, error } = await supabase
        .from('animals')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating animal:', error);
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Error in animalService.update:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('animals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting animal:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in animalService.delete:', error);
      throw error;
    }
  },

  search: async (query: string): Promise<Animal[]> => {
    try {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .or(`name.ilike.%${query}%,species.ilike.%${query}%,description.ilike.%${query}%`);

      if (error) {
        console.error('Error searching animals:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in animalService.search:', error);
      return [];
    }
  },

  addToFavorites: async (animalId: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('favorites')
        .insert([{
          user_id: user.id,
          animal_id: animalId
        }]);

      if (error) {
        console.error('Error adding to favorites:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in animalService.addToFavorites:', error);
      throw error;
    }
  },

  removeFromFavorites: async (animalId: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('animal_id', animalId);

      if (error) {
        console.error('Error removing from favorites:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in animalService.removeFromFavorites:', error);
      throw error;
    }
  },

  getFavorites: async (): Promise<Animal[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          animals (*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
        throw error;
      }

      return data?.map((item: any) => item.animals) || [];
    } catch (error) {
      console.error('Error in animalService.getFavorites:', error);
      return [];
    }
  },
};






