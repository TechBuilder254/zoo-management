import { Router } from 'express';
import { auth } from '../middleware/auth';
import { getFinancialData, getFinancialSummary } from '../controllers/financialController';

const router = Router();

// All routes require authentication
router.use(auth);

// GET /api/financial/data - Get comprehensive financial data
router.get('/data', getFinancialData);

// GET /api/financial/summary - Get financial summary for dashboard
router.get('/summary', getFinancialSummary);

export default router;
