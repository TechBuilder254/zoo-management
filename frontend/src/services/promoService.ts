import { supabase } from '../config/supabase';

export interface PromoCode {
  id: string;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discount_type?: 'PERCENTAGE' | 'FIXED_AMOUNT'; // Backend snake_case
  discountValue: number;
  discount_value?: number; // Backend snake_case
  maxUses?: number;
  max_uses?: number; // Backend snake_case
  usedCount: number;
  used_count?: number; // Backend snake_case
  isActive: boolean;
  is_active?: boolean; // Backend snake_case
  validFrom: string;
  valid_from?: string; // Backend snake_case
  validUntil: string;
  valid_until?: string; // Backend snake_case
  createdAt: string;
  created_at?: string; // Backend snake_case
  updatedAt: string;
  updated_at?: string; // Backend snake_case
}

export interface CreatePromoCodeData {
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxUses?: number;
  validFrom: string;
  validUntil: string;
}

export interface UpdatePromoCodeData {
  code?: string;
  description?: string;
  discountType?: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue?: number;
  maxUses?: number;
  validFrom?: string;
  validUntil?: string;
  isActive?: boolean;
}

export interface PromoValidationResult {
  valid: boolean;
  promoCode?: {
    id: string;
    code: string;
    description?: string;
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue: number;
  };
  discountAmount: number;
  originalAmount: number;
  finalAmount: number;
}

export const promoService = {
  // Get all promo codes (Admin only)
  getAll: async (): Promise<PromoCode[]> => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching promo codes:', error);
        throw error;
      }

      return (data || []).map((promo: any) => ({
        id: promo.id,
        code: promo.code,
        description: promo.description,
        discountType: promo.discount_type,
        discount_type: promo.discount_type,
        discountValue: promo.discount_value,
        discount_value: promo.discount_value,
        maxUses: promo.max_uses,
        max_uses: promo.max_uses,
        usedCount: promo.used_count,
        used_count: promo.used_count,
        isActive: promo.is_active,
        is_active: promo.is_active,
        validFrom: promo.valid_from,
        valid_from: promo.valid_from,
        validUntil: promo.valid_until,
        valid_until: promo.valid_until,
        createdAt: promo.created_at,
        updatedAt: promo.updated_at,
      }));
    } catch (error) {
      console.error('Error in promoService.getAll:', error);
      return [];
    }
  },

  // Get promo code by ID (Admin only)
  getById: async (id: string): Promise<PromoCode> => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching promo code:', error);
        throw error;
      }

      return {
        id: data.id,
        code: data.code,
        description: data.description,
        discountType: data.discount_type,
        discount_type: data.discount_type,
        discountValue: data.discount_value,
        discount_value: data.discount_value,
        maxUses: data.max_uses,
        max_uses: data.max_uses,
        usedCount: data.used_count,
        used_count: data.used_count,
        isActive: data.is_active,
        is_active: data.is_active,
        validFrom: data.valid_from,
        valid_from: data.valid_from,
        validUntil: data.valid_until,
        valid_until: data.valid_until,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error in promoService.getById:', error);
      throw error;
    }
  },

  // Create promo code (Admin only)
  create: async (data: CreatePromoCodeData): Promise<PromoCode> => {
    try {
      const { data: result, error } = await supabase
        .from('promo_codes')
        .insert([{
          code: data.code,
          description: data.description,
          discount_type: data.discountType,
          discount_value: data.discountValue,
          max_uses: data.maxUses,
          valid_from: data.validFrom,
          valid_until: data.validUntil,
          is_active: true,
          used_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating promo code:', error);
        throw error;
      }

      return {
        id: result.id,
        code: result.code,
        description: result.description,
        discountType: result.discount_type,
        discount_type: result.discount_type,
        discountValue: result.discount_value,
        discount_value: result.discount_value,
        maxUses: result.max_uses,
        max_uses: result.max_uses,
        usedCount: result.used_count,
        used_count: result.used_count,
        isActive: result.is_active,
        is_active: result.is_active,
        validFrom: result.valid_from,
        valid_from: result.valid_from,
        validUntil: result.valid_until,
        valid_until: result.valid_until,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      };
    } catch (error) {
      console.error('Error in promoService.create:', error);
      throw error;
    }
  },

  // Update promo code (Admin only)
  update: async (id: string, data: UpdatePromoCodeData): Promise<PromoCode> => {
    try {
      const { data: result, error } = await supabase
        .from('promo_codes')
        .update({
          code: data.code,
          description: data.description,
          discount_type: data.discountType,
          discount_value: data.discountValue,
          max_uses: data.maxUses,
          valid_from: data.validFrom,
          valid_until: data.validUntil,
          is_active: data.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating promo code:', error);
        throw error;
      }

      return {
        id: result.id,
        code: result.code,
        description: result.description,
        discountType: result.discount_type,
        discount_type: result.discount_type,
        discountValue: result.discount_value,
        discount_value: result.discount_value,
        maxUses: result.max_uses,
        max_uses: result.max_uses,
        usedCount: result.used_count,
        used_count: result.used_count,
        isActive: result.is_active,
        is_active: result.is_active,
        validFrom: result.valid_from,
        valid_from: result.valid_from,
        validUntil: result.valid_until,
        valid_until: result.valid_until,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      };
    } catch (error) {
      console.error('Error in promoService.update:', error);
      throw error;
    }
  },

  // Delete promo code (Admin only)
  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting promo code:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in promoService.delete:', error);
      throw error;
    }
  },

  // Force delete promo code and all related bookings (Admin only - Dangerous)
  forceDelete: async (id: string): Promise<{ message: string; deletedBookings: number }> => {
    try {
      // First, get count of bookings using this promo code
      const { count: deletedBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('promo_code_id', id);

      // Update bookings to remove promo code reference
      await supabase
        .from('bookings')
        .update({ promo_code_id: null })
        .eq('promo_code_id', id);

      // Delete the promo code
      await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      return {
        message: 'Promo code and related bookings updated successfully',
        deletedBookings: deletedBookings || 0,
      };
    } catch (error) {
      console.error('Error in promoService.forceDelete:', error);
      throw error;
    }
  },

  // Validate promo code (Public)
  validate: async (code: string, totalAmount: number): Promise<PromoValidationResult> => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return {
          valid: false,
          discountAmount: 0,
          originalAmount: totalAmount,
          finalAmount: totalAmount,
        };
      }

      // Check if promo code is still valid
      const now = new Date();
      const validFrom = new Date(data.valid_from);
      const validUntil = new Date(data.valid_until);

      if (now < validFrom || now > validUntil) {
        return {
          valid: false,
          discountAmount: 0,
          originalAmount: totalAmount,
          finalAmount: totalAmount,
        };
      }

      // Check if max uses exceeded
      if (data.max_uses && data.used_count >= data.max_uses) {
        return {
          valid: false,
          discountAmount: 0,
          originalAmount: totalAmount,
          finalAmount: totalAmount,
        };
      }

      // Calculate discount
      const discountAmount = data.discount_type === 'PERCENTAGE' 
        ? (totalAmount * data.discount_value) / 100
        : data.discount_value;

      return {
        valid: true,
        promoCode: {
          id: data.id,
          code: data.code,
          discountType: data.discount_type,
          discountValue: data.discount_value,
        },
        discountAmount,
        originalAmount: totalAmount,
        finalAmount: totalAmount - discountAmount,
      };
    } catch (error) {
      console.error('Error in promoService.validate:', error);
      return {
        valid: false,
        discountAmount: 0,
        originalAmount: totalAmount,
        finalAmount: totalAmount,
      };
    }
  },
};
