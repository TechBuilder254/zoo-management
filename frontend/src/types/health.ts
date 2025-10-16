export interface HealthRecord {
  id: string;
  checkup_date: string; // snake_case from Supabase
  diagnosis: string;
  treatment?: string;
  vet_name: string; // snake_case from Supabase
  notes?: string;
  animal_id: string; // snake_case from Supabase
  created_at: string; // snake_case from Supabase
  updated_at: string; // snake_case from Supabase
}

export interface CreateHealthRecordData {
  checkup_date: string;
  diagnosis: string;
  treatment?: string;
  vet_name: string;
  notes?: string;
  animal_id: string;
}

export interface UpdateHealthRecordData {
  id: string;
  checkup_date?: string;
  diagnosis?: string;
  treatment?: string;
  vet_name?: string;
  notes?: string;
}

