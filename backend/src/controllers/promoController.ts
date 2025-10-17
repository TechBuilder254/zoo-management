import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Get all promo codes (Admin only)
export const getAllPromoCodes = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const promoCodes = await prisma.promoCode.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(promoCodes);
  } catch (error: any) {
    console.error('Get promo codes error:', error);
    res.status(500).json({ error: 'Error fetching promo codes' });
  }
};

// Get promo code by ID (Admin only)
export const getPromoCodeById = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const promoCode = await prisma.promoCode.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            users: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    if (!promoCode) {
      return res.status(404).json({ error: 'Promo code not found' });
    }

    res.json(promoCode);
  } catch (error: any) {
    console.error('Get promo code error:', error);
    res.status(500).json({ error: 'Error fetching promo code' });
  }
};

// Create promo code (Admin only)
export const createPromoCode = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      maxUses,
      validFrom,
      validUntil
    } = req.body;

    // Validation
    if (!code || !discountType || !discountValue || !validFrom || !validUntil) {
      return res.status(400).json({ 
        error: 'Code, discount type, discount value, valid from, and valid until are required' 
      });
    }

    if (discountValue <= 0) {
      return res.status(400).json({ error: 'Discount value must be greater than 0' });
    }

    if (discountType === 'PERCENTAGE' && discountValue > 100) {
      return res.status(400).json({ error: 'Percentage discount cannot exceed 100%' });
    }

    const validFromDate = new Date(validFrom);
    const validUntilDate = new Date(validUntil);

    if (validUntilDate <= validFromDate) {
      return res.status(400).json({ error: 'Valid until date must be after valid from date' });
    }

    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        description,
        discount_type: discountType,
        discount_value: discountValue,
        max_uses: maxUses,
        valid_from: validFromDate,
        valid_until: validUntilDate,
        is_active: true
      }
    });

    res.status(201).json(promoCode);
  } catch (error: any) {
    console.error('Create promo code error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Promo code already exists' });
    }
    res.status(500).json({ error: 'Error creating promo code' });
  }
};

// Update promo code (Admin only)
export const updatePromoCode = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const {
      code,
      description,
      discountType,
      discountValue,
      maxUses,
      validFrom,
      validUntil,
      isActive
    } = req.body;

    const updateData: any = {};
    if (code !== undefined) updateData.code = code.toUpperCase();
    if (description !== undefined) updateData.description = description;
    if (discountType !== undefined) updateData.discountType = discountType;
    if (discountValue !== undefined) updateData.discountValue = discountValue;
    if (maxUses !== undefined) updateData.maxUses = maxUses;
    if (validFrom !== undefined) updateData.validFrom = new Date(validFrom);
    if (validUntil !== undefined) updateData.validUntil = new Date(validUntil);
    if (isActive !== undefined) updateData.is_active = isActive;

    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: updateData
    });

    res.json(promoCode);
  } catch (error: any) {
    console.error('Update promo code error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Promo code already exists' });
    }
    res.status(500).json({ error: 'Error updating promo code' });
  }
};

// Delete promo code (Admin only)
export const deletePromoCode = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    
    // Check if there are any bookings using this promo code
    const bookingsWithPromo = await prisma.booking.count({
      where: { promo_code_id: id }
    });

    if (bookingsWithPromo > 0) {
      return res.status(400).json({ 
        error: `Cannot delete promo code. It is being used by ${bookingsWithPromo} booking(s). Please deactivate it instead.`,
        bookingsCount: bookingsWithPromo
      });
    }

    await prisma.promoCode.delete({
      where: { id }
    });

    res.json({ message: 'Promo code deleted successfully' });
  } catch (error: any) {
    console.error('Delete promo code error:', error);
    
    // Handle foreign key constraint errors specifically
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'Cannot delete promo code. It is being used by existing bookings. Please deactivate it instead.' 
      });
    }
    
    res.status(500).json({ error: 'Error deleting promo code' });
  }
};

// Force delete promo code and all related bookings (Admin only - Dangerous)
export const forceDeletePromoCode = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    
    // Get count of bookings that will be deleted
    const bookingsCount = await prisma.booking.count({
      where: { promo_code_id: id }
    });

    // Delete all related bookings first, then the promo code
    await prisma.$transaction(async (tx: any) => {
      // Delete all bookings that use this promo code
      await tx.booking.deleteMany({
        where: { promo_code_id: id }
      });
      
      // Delete the promo code
      await tx.promoCode.delete({
        where: { id }
      });
    });

    res.json({ 
      message: `Promo code and ${bookingsCount} related booking(s) deleted successfully`,
      deletedBookings: bookingsCount
    });
  } catch (error: any) {
    console.error('Force delete promo code error:', error);
    res.status(500).json({ error: 'Error force deleting promo code' });
  }
};

// Validate promo code (Public)
export const validatePromoCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const { totalAmount } = req.body;

    if (!code || !totalAmount) {
      return res.status(400).json({ error: 'Code and total amount are required' });
    }

    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!promoCode) {
      return res.status(404).json({ error: 'Invalid promo code' });
    }

    // Check if promo code is active
    if (!promoCode.is_active) {
      return res.status(400).json({ error: 'Promo code is inactive' });
    }

    // Check validity dates
    const now = new Date();
    if (now < promoCode.valid_from || now > promoCode.valid_until) {
      return res.status(400).json({ error: 'Promo code has expired' });
    }

    // Check usage limits
    if (promoCode.max_uses && promoCode.used_count >= promoCode.max_uses) {
      return res.status(400).json({ error: 'Promo code has reached maximum usage limit' });
    }

    // Calculate discount
    let discountAmount = 0;
    if (promoCode.discount_type === 'PERCENTAGE') {
      discountAmount = (totalAmount * promoCode.discount_value) / 100;
    } else {
      discountAmount = Math.min(promoCode.discount_value, totalAmount);
    }

    const finalAmount = Math.max(0, totalAmount - discountAmount);

    res.json({
      valid: true,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
        description: promoCode.description,
        discount_type: promoCode.discount_type,
        discount_value: promoCode.discount_value
      },
      discountAmount,
      originalAmount: totalAmount,
      finalAmount
    });
  } catch (error: any) {
    console.error('Validate promo code error:', error);
    res.status(500).json({ error: 'Error validating promo code' });
  }
};

// Use promo code (when booking is created)
export const usePromoCode = async (promoCodeId: string) => {
  try {
    await prisma.promoCode.update({
      where: { id: promoCodeId },
      data: {
        used_count: {
          increment: 1
        }
      }
    });
  } catch (error: any) {
    console.error('Use promo code error:', error);
    throw error;
  }
};
