import api from './api';

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
    const response = await api.get('/promos');
    return response.data;
  },

  // Get promo code by ID (Admin only)
  getById: async (id: string): Promise<PromoCode> => {
    const response = await api.get(`/promos/${id}`);
    return response.data;
  },

  // Create promo code (Admin only)
  create: async (data: CreatePromoCodeData): Promise<PromoCode> => {
    const response = await api.post('/promos', data);
    return response.data;
  },

  // Update promo code (Admin only)
  update: async (id: string, data: UpdatePromoCodeData): Promise<PromoCode> => {
    const response = await api.put(`/promos/${id}`, data);
    return response.data;
  },

  // Delete promo code (Admin only)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/promos/${id}`);
  },

  // Force delete promo code and all related bookings (Admin only - Dangerous)
  forceDelete: async (id: string): Promise<{ message: string; deletedBookings: number }> => {
    const response = await api.delete(`/promos/${id}/force`);
    return response.data;
  },

  // Validate promo code (Public) - Mock implementation
  validate: async (code: string, totalAmount: number): Promise<PromoValidationResult> => {
    // Mock promo code validation since no backend is running
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPromoCodes = {
          'MM': { discountType: 'FIXED_AMOUNT' as const, discountValue: 500 },
          'WILDLIFE10': { discountType: 'PERCENTAGE' as const, discountValue: 10 },
          'FAMILY15': { discountType: 'PERCENTAGE' as const, discountValue: 15 },
          'SUMMER20': { discountType: 'PERCENTAGE' as const, discountValue: 20 },
        };

        const promo = mockPromoCodes[code as keyof typeof mockPromoCodes];
        
        if (promo) {
          const discountAmount = promo.discountType === 'PERCENTAGE' 
            ? (totalAmount * promo.discountValue) / 100
            : promo.discountValue;
          
          resolve({
            valid: true,
            promoCode: {
              id: `promo_${code}`,
              code,
              discountType: promo.discountType,
              discountValue: promo.discountValue,
            },
            discountAmount,
            originalAmount: totalAmount,
            finalAmount: totalAmount - discountAmount,
          });
        } else {
          resolve({
            valid: false,
            discountAmount: 0,
            originalAmount: totalAmount,
            finalAmount: totalAmount,
          });
        }
      }, 500);
    });
  },
};
