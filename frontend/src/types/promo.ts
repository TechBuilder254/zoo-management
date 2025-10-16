export interface PromoCode {
  id: string;
  code: string;
  description?: string;
  discount_type: 'PERCENTAGE' | 'FIXED_AMOUNT'; // snake_case from Supabase
  discount_value: number; // snake_case from Supabase
  max_uses?: number; // snake_case from Supabase
  used_count: number; // snake_case from Supabase
  is_active: boolean; // snake_case from Supabase
  valid_from: string; // snake_case from Supabase
  valid_until: string; // snake_case from Supabase
  created_at: string; // snake_case from Supabase
  updated_at: string; // snake_case from Supabase
}

export interface CreatePromoCodeData {
  code: string;
  description?: string;
  discount_type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discount_value: number;
  max_uses?: number;
  valid_from: string;
  valid_until: string;
}

export interface UpdatePromoCodeData {
  id: string;
  description?: string;
  discount_type?: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discount_value?: number;
  max_uses?: number;
  is_active?: boolean;
  valid_from?: string;
  valid_until?: string;
}


