import { supabase } from '../config/supabase';

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

// Internal: map DB row to frontend HealthRecord
const mapDbToFrontend = (row: any): HealthRecord => {
  const [typeFromNotes, statusFromNotes] = (row.notes || '').split('|');
  return {
    id: row.id,
    animal_id: row.animal_id,
    type: (typeFromNotes as any) || 'CHECKUP',
    description: row.diagnosis || '',
    veterinarian: row.vet_name || '',
    medications: row.treatment ? String(row.treatment).split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    next_appointment: row.checkup_date || undefined,
    status: (statusFromNotes as any) || 'SCHEDULED',
    created_at: row.created_at,
    updated_at: row.updated_at,
    animal: {
      id: row.animals?.id,
      name: row.animals?.name,
      species: row.animals?.species,
      image_url: row.animals?.image_url,
    },
  };
};

// Internal: map frontend payload to DB columns
const mapCreateToDb = (data: CreateHealthRecordData) => ({
  animal_id: data.animal_id,
  diagnosis: data.description,
  treatment: (data.medications || []).join(', '),
  vet_name: data.veterinarian,
  notes: `${data.type || 'CHECKUP'}|${data.status || 'SCHEDULED'}`,
  checkup_date: data.next_appointment || new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const mapUpdateToDb = (data: UpdateHealthRecordData) => ({
  diagnosis: data.description,
  treatment: data.medications ? data.medications.join(', ') : undefined,
  vet_name: data.veterinarian,
  notes: data.type || data.status ? `${data.type || 'CHECKUP'}|${data.status || 'SCHEDULED'}` : undefined,
  checkup_date: data.next_appointment,
  updated_at: new Date().toISOString(),
});

export const healthService = {
  // Get all health records
  getAll: async (params?: { animalId?: string; status?: string; type?: string }): Promise<HealthRecord[]> => {
    try {
      let query = supabase
        .from('health_records')
        .select(`
          *,
          animals (
            id,
            name,
            species,
            image_url
          )
        `);

      if (params?.animalId) {
        query = query.eq('animal_id', params.animalId);
      }
      if (params?.status) {
        // filter via notes second segment
        query = query.like('notes', `%|${params.status}%`);
      }
      if (params?.type) {
        query = query.like('notes', `${params.type}|%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching health records:', error);
        throw error;
      }

      return (data || []).map(mapDbToFrontend);
    } catch (error) {
      console.error('Error in healthService.getAll:', error);
      return [];
    }
  },

  // Get health record by ID
  getById: async (id: string): Promise<HealthRecord> => {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select(`
          *,
          animals!health_records_animal_id_fkey (
            id,
            name,
            species,
            image_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching health record:', error);
        throw error;
      }

      return mapDbToFrontend(data);
    } catch (error) {
      console.error('Error in healthService.getById:', error);
      throw error;
    }
  },

  // Create health record
  create: async (data: CreateHealthRecordData): Promise<HealthRecord> => {
    try {
      const payload = mapCreateToDb(data);
      const { data: result, error } = await supabase
        .from('health_records')
        .insert([payload])
        .select(`
          *,
          animals!health_records_animal_id_fkey (
            id,
            name,
            species,
            image_url
          )
        `)
        .single();

      if (error) {
        console.error('Error creating health record:', error);
        throw error;
      }

      return mapDbToFrontend(result);
    } catch (error) {
      console.error('Error in healthService.create:', error);
      throw error;
    }
  },

  // Update health record
  update: async (id: string, data: UpdateHealthRecordData): Promise<HealthRecord> => {
    try {
      const payload = mapUpdateToDb(data);
      const { data: result, error } = await supabase
        .from('health_records')
        .update(payload)
        .eq('id', id)
        .select(`
          *,
          animals!health_records_animal_id_fkey (
            id,
            name,
            species,
            image_url
          )
        `)
        .single();

      if (error) {
        console.error('Error updating health record:', error);
        throw error;
      }

      return mapDbToFrontend(result);
    } catch (error) {
      console.error('Error in healthService.update:', error);
      throw error;
    }
  },

  // Delete health record
  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting health record:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in healthService.delete:', error);
      throw error;
    }
  },

  // Get health statistics
  getStats: async (): Promise<HealthStats> => {
    try {
      const { count: totalRecords } = await supabase
        .from('health_records')
        .select('*', { count: 'exact', head: true });

      const { count: upcomingAppointments } = await supabase
        .from('health_records')
        .select('*', { count: 'exact', head: true })
        .like('notes', `%|SCHEDULED%`);

      const { count: healthAlerts } = await supabase
        .from('health_records')
        .select('*', { count: 'exact', head: true })
        .like('notes', `EMERGENCY|%`);

      const { count: activeTreatments } = await supabase
        .from('health_records')
        .select('*', { count: 'exact', head: true })
        .like('notes', `%|IN_PROGRESS%`);

      return {
        totalRecords: totalRecords || 0,
        upcomingAppointments: upcomingAppointments || 0,
        healthAlerts: healthAlerts || 0,
        activeTreatments: activeTreatments || 0,
      };
    } catch (error) {
      console.error('Error in healthService.getStats:', error);
      return {
        totalRecords: 0,
        upcomingAppointments: 0,
        healthAlerts: 0,
        activeTreatments: 0,
      };
    }
  },

  // Get upcoming appointments
  getUpcomingAppointments: async (): Promise<HealthRecord[]> => {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select(`
          *,
          animals!health_records_animal_id_fkey (
            id,
            name,
            species,
            image_url
          )
        `)
        .like('notes', `%|SCHEDULED%`)
        .order('checkup_date', { ascending: true });

      if (error) {
        console.error('Error fetching upcoming appointments:', error);
        throw error;
      }

      return (data || []).map(mapDbToFrontend);
    } catch (error) {
      console.error('Error in healthService.getUpcomingAppointments:', error);
      return [];
    }
  },

  // Get health alerts
  getHealthAlerts: async (): Promise<HealthRecord[]> => {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select(`
          *,
          animals!health_records_animal_id_fkey (
            id,
            name,
            species,
            image_url
          )
        `)
        .like('notes', `EMERGENCY|%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching health alerts:', error);
        throw error;
      }

      return (data || []).map(mapDbToFrontend);
    } catch (error) {
      console.error('Error in healthService.getHealthAlerts:', error);
      return [];
    }
  }
};

