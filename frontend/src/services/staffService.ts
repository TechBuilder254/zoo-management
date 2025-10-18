import { supabase } from '../config/supabase';

// Match the exact database schema
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'VISITOR' | 'ADMIN' | 'STAFF';
  created_at: string;
  updated_at: string;
}

export interface CreateStaffData {
  name: string;
  email: string;
  password: string;
  role: 'VISITOR' | 'ADMIN' | 'STAFF';
}

export interface UpdateStaffData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'VISITOR' | 'ADMIN' | 'STAFF';
}

export interface StaffResponse {
  staff: StaffMember[];
  total: number;
  page?: number;
  totalPages?: number;
}

export const staffService = {
  // Get all staff members from users table - matches exact database schema
  getAll: async (): Promise<StaffResponse> => {
    try {
      console.log('🔍 Fetching users from Supabase...');
      
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase error fetching users:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        throw error;
      }

      console.log('📊 Raw data from Supabase:', data);
      console.log('📊 Number of users found:', data?.length || 0);

      // Return data directly as it matches the database schema
      const staffMembers = (data || []).map((user: any) => ({
        id: user.id,
        name: user.name || 'Unknown User',
        email: user.email || '',
        password: user.password, // Keep password field for admin operations
        role: user.role || 'VISITOR',
        created_at: user.created_at,
        updated_at: user.updated_at,
      }));

      console.log('✅ Processed staff members:', staffMembers);
      return {
        staff: staffMembers,
        total: count || 0
      };
    } catch (error) {
      console.error('❌ Error in staffService.getAll:', error);
      return {
        staff: [],
        total: 0
      };
    }
  },

  // Get staff member by ID - matches database schema
  getById: async (id: string): Promise<StaffMember> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching staff member:', error);
        throw error;
      }

      return {
        id: data.id,
        name: data.name || 'Unknown User',
        email: data.email || '',
        password: data.password,
        role: data.role || 'VISITOR',
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (error) {
      console.error('Error in staffService.getById:', error);
      throw error;
    }
  },

  // Create new staff member - matches database schema
  create: async (data: CreateStaffData): Promise<StaffMember> => {
    try {
      console.log('🔍 Creating staff member:', data);

      const { data: result, error } = await supabase
        .from('users')
        .insert([{
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating staff member:', error);
        throw error;
      }

      return {
        id: result.id,
        name: result.name,
        email: result.email,
        password: result.password,
        role: result.role,
        created_at: result.created_at,
        updated_at: result.updated_at,
      };
    } catch (error) {
      console.error('Error in staffService.create:', error);
      throw error;
    }
  },

  // Update staff member - matches database schema
  update: async (id: string, data: UpdateStaffData): Promise<StaffMember> => {
    try {
      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.email) updateData.email = data.email;
      if (data.role) updateData.role = data.role;
      if (data.password && data.password.trim() !== '') {
        updateData.password = data.password;
      }

      console.log('🔍 Updating staff member:', id, updateData);

      const { data: result, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating staff member:', error);
        throw error;
      }

      return {
        id: result.id,
        name: result.name,
        email: result.email,
        password: result.password,
        role: result.role,
        created_at: result.created_at,
        updated_at: result.updated_at,
      };
    } catch (error) {
      console.error('Error in staffService.update:', error);
      throw error;
    }
  },

  // Delete staff member
  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting staff member:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in staffService.delete:', error);
      throw error;
    }
  },
};
