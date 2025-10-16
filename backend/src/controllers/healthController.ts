import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { invalidateCache } from '../utils/cache';

// Get all health records
export const getHealthRecords = async (req: Request, res: Response) => {
  try {
    const { animalId } = req.query;

    const where: any = {};
    if (animalId) where.animal_id = animalId;

    const records = await prisma.healthRecord.findMany({
      where,
      include: {
        animals: {
          select: {
            id: true,
            name: true,
            species: true,
            image_url: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Map DB schema -> API schema expected by frontend
    const mapped = records.map((r: any) => ({
      id: r.id,
      animal_id: r.animal_id,
      type: 'CHECKUP',
      description: r.diagnosis,
      veterinarian: r.vet_name,
      medications: r.treatment ? [r.treatment] : [],
      next_appointment: r.checkup_date || null,
      status: 'COMPLETED',
      created_at: r.created_at,
      updated_at: r.updated_at,
      animal: {
        id: r.animals?.id,
        name: r.animals?.name,
        species: r.animals?.species,
        image_url: r.animals?.image_url || null,
      },
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Get health records error:', error);
    res.status(500).json({ error: 'Error fetching health records' });
  }
};

// Get health record by ID
export const getHealthRecordById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const record = await prisma.healthRecord.findUnique({
      where: { id },
      include: {
        animals: {
          select: {
            id: true,
            name: true,
            species: true,
            image_url: true
          }
        }
      }
    });

    if (!record) {
      return res.status(404).json({ error: 'Health record not found' });
    }

    const mapped: any = {
      id: record.id,
      animal_id: record.animal_id,
      type: 'CHECKUP',
      description: record.diagnosis,
      veterinarian: record.vet_name,
      medications: record.treatment ? [record.treatment] : [],
      next_appointment: record.checkup_date || null,
      status: 'COMPLETED',
      created_at: record.created_at,
      updated_at: record.updated_at,
      animal: {
        id: (record as any).animals?.id,
        name: (record as any).animals?.name,
        species: (record as any).animals?.species,
        image_url: (record as any).animals?.image_url || null,
      },
    };

    res.json(mapped);
  } catch (error) {
    console.error('Get health record error:', error);
    res.status(500).json({ error: 'Error fetching health record' });
  }
};

// Create health record
export const createHealthRecord = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'STAFF') {
      return res.status(403).json({ error: 'Admin or staff access required' });
    }

    const { animal_id, type, description, veterinarian, medications, next_appointment } = req.body;

    if (!animal_id || !description || !veterinarian) {
      return res.status(400).json({ error: 'Animal ID, description (diagnosis), and veterinarian are required' });
    }

    const record = await prisma.healthRecord.create({
      data: {
        animal_id,
        diagnosis: description,
        vet_name: veterinarian,
        treatment: Array.isArray(medications) ? medications.join(', ') : medications || null,
        checkup_date: next_appointment ? new Date(next_appointment) : null,
        notes: type ? String(type) : null,
      },
      include: {
        animals: {
          select: { id: true, name: true, species: true, image_url: true },
        },
      },
    });

    invalidateCache.health();
    res.status(201).json({
      id: record.id,
      animal_id: record.animal_id,
      type: type || 'CHECKUP',
      description: record.diagnosis,
      veterinarian: record.vet_name,
      medications: record.treatment ? [record.treatment] : [],
      next_appointment: record.checkup_date || null,
      status: 'SCHEDULED',
      created_at: record.created_at,
      updated_at: record.updated_at,
      animal: (record as any).animals,
    });
  } catch (error) {
    console.error('Create health record error:', error);
    res.status(500).json({ error: 'Error creating health record' });
  }
};

// Update health record
export const updateHealthRecord = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'STAFF') {
      return res.status(403).json({ error: 'Admin or staff access required' });
    }

    const { id } = req.params;
    const updateData = req.body as any;

    const mappedUpdate: any = {};
    if (updateData.description !== undefined) mappedUpdate.diagnosis = updateData.description;
    if (updateData.veterinarian !== undefined) mappedUpdate.vet_name = updateData.veterinarian;
    if (updateData.medications !== undefined) {
      mappedUpdate.treatment = Array.isArray(updateData.medications)
        ? updateData.medications.join(', ')
        : updateData.medications;
    }
    if (updateData.next_appointment !== undefined) {
      mappedUpdate.checkup_date = updateData.next_appointment ? new Date(updateData.next_appointment) : null;
    }
    if (updateData.type !== undefined) mappedUpdate.notes = String(updateData.type);

    const record = await prisma.healthRecord.update({
      where: { id },
      data: mappedUpdate,
      include: {
        animals: { select: { id: true, name: true, species: true, image_url: true } },
      }
    });

    invalidateCache.health();
    res.json({
      id: record.id,
      animal_id: record.animal_id,
      type: record.notes || 'CHECKUP',
      description: record.diagnosis,
      veterinarian: record.vet_name,
      medications: record.treatment ? [record.treatment] : [],
      next_appointment: record.checkup_date || null,
      status: 'COMPLETED',
      created_at: record.created_at,
      updated_at: record.updated_at,
      animal: (record as any).animals,
    });
  } catch (error) {
    console.error('Update health record error:', error);
    res.status(500).json({ error: 'Error updating health record' });
  }
};

// Delete health record
export const deleteHealthRecord = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    
    await prisma.healthRecord.delete({
      where: { id }
    });

    invalidateCache.health();
    res.json({ message: 'Health record deleted successfully' });
  } catch (error) {
    console.error('Delete health record error:', error);
    res.status(500).json({ error: 'Error deleting health record' });
  }
};

// Get health statistics
export const getHealthStats = async (req: Request, res: Response) => {
  try {
    const totalRecords = await prisma.healthRecord.count();

    const upcomingAppointments = await prisma.healthRecord.count({
      where: { checkup_date: { gte: new Date() } },
    });

    const activeTreatments = await prisma.healthRecord.count({
      where: { NOT: { treatment: null } },
    });

    const healthAlerts = await prisma.healthRecord.count({
      where: {
        OR: [
          { checkup_date: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } },
          { notes: { contains: 'EMERGENCY', mode: 'insensitive' } },
        ],
      },
    });

    res.json({
      totalRecords,
      upcomingAppointments,
      healthAlerts,
      activeTreatments
    });
  } catch (error) {
    console.error('Get health stats error:', error);
    res.status(500).json({ error: 'Error fetching health statistics' });
  }
};

// Get upcoming appointments
export const getUpcomingAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await prisma.healthRecord.findMany({
      where: { checkup_date: { gte: new Date() } },
      include: { animals: { select: { id: true, name: true, species: true, image_url: true } } },
      orderBy: { checkup_date: 'asc' },
    });

    const mapped = appointments.map((r: any) => ({
      id: r.id,
      animal_id: r.animal_id,
      type: r.notes || 'CHECKUP',
      description: r.diagnosis,
      veterinarian: r.vet_name,
      medications: r.treatment ? [r.treatment] : [],
      next_appointment: r.checkup_date || null,
      status: 'SCHEDULED',
      created_at: r.created_at,
      updated_at: r.updated_at,
      animal: r.animals,
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Get upcoming appointments error:', error);
    res.status(500).json({ error: 'Error fetching upcoming appointments' });
  }
};

// Get health alerts
export const getHealthAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await prisma.healthRecord.findMany({
      where: {
        OR: [
          { checkup_date: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } },
          { notes: { contains: 'EMERGENCY', mode: 'insensitive' } },
        ],
      },
      include: { animals: { select: { id: true, name: true, species: true, image_url: true } } },
      orderBy: { created_at: 'desc' },
    });

    const mapped = alerts.map((r: any) => ({
      id: r.id,
      animal_id: r.animal_id,
      type: r.notes || 'CHECKUP',
      description: r.diagnosis,
      veterinarian: r.vet_name,
      medications: r.treatment ? [r.treatment] : [],
      next_appointment: r.checkup_date || null,
      status: r.notes?.toUpperCase() === 'EMERGENCY' ? 'IN_PROGRESS' : 'COMPLETED',
      created_at: r.created_at,
      updated_at: r.updated_at,
      animal: r.animals,
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Get health alerts error:', error);
    res.status(500).json({ error: 'Error fetching health alerts' });
  }
};
