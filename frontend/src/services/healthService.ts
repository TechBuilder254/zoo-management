import api from './api';

export interface HealthRecord {
  id: string;
  animal_id: string;
  type: 'VACCINATION' | 'CHECKUP' | 'TREATMENT' | 'EMERGENCY' | 'SURGERY';
  description: string;
  veterinarian: string;
  medications: string[];
  next_appointment?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  updated_at: string;
  animal: {
    id: string;
    name: string;
    species: string;
    image_url?: string;
  };
}

export interface HealthStats {
  totalRecords: number;
  upcomingAppointments: number;
  healthAlerts: number;
  activeTreatments: number;
}

export interface CreateHealthRecordData {
  animal_id: string;
  type: string;
  description: string;
  veterinarian: string;
  medications?: string[];
  next_appointment?: string;
  status?: string;
}

export interface UpdateHealthRecordData {
  type?: string;
  description?: string;
  veterinarian?: string;
  medications?: string[];
  next_appointment?: string;
  status?: string;
}

export const healthService = {
  // Get all health records
  getAll: async (params?: { animalId?: string; status?: string; type?: string }): Promise<HealthRecord[]> => {
    const response = await api.get('/health', { params });
    return response.data;
  },

  // Get health record by ID
  getById: async (id: string): Promise<HealthRecord> => {
    const response = await api.get(`/health/${id}`);
    return response.data;
  },

  // Create health record
  create: async (data: CreateHealthRecordData): Promise<HealthRecord> => {
    const response = await api.post('/health', data);
    return response.data;
  },

  // Update health record
  update: async (id: string, data: UpdateHealthRecordData): Promise<HealthRecord> => {
    const response = await api.put(`/health/${id}`, data);
    return response.data;
  },

  // Delete health record
  delete: async (id: string): Promise<void> => {
    await api.delete(`/health/${id}`);
  },

  // Get health statistics
  getStats: async (): Promise<HealthStats> => {
    const response = await api.get('/health/stats');
    return response.data;
  },

  // Get upcoming appointments
  getUpcomingAppointments: async (): Promise<HealthRecord[]> => {
    const response = await api.get('/health/appointments');
    return response.data;
  },

  // Get health alerts
  getHealthAlerts: async (): Promise<HealthRecord[]> => {
    const response = await api.get('/health/alerts');
    return response.data;
  }
};

