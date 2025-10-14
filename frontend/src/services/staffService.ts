import api from './api';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateStaffData {
  name?: string;
  email?: string;
  role?: string;
}

export const staffService = {
  // Get all staff members
  getAll: async (): Promise<StaffMember[]> => {
    const response = await api.get('/staff');
    return response.data;
  },

  // Get staff member by ID
  getById: async (id: string): Promise<StaffMember> => {
    const response = await api.get(`/staff/${id}`);
    return response.data;
  },

  // Create new staff member
  create: async (data: CreateStaffData): Promise<StaffMember> => {
    const response = await api.post('/staff', data);
    return response.data;
  },

  // Update staff member
  update: async (id: string, data: UpdateStaffData): Promise<StaffMember> => {
    const response = await api.put(`/staff/${id}`, data);
    return response.data;
  },

  // Delete staff member
  delete: async (id: string): Promise<void> => {
    await api.delete(`/staff/${id}`);
  },
};
