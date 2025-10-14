import { Router } from 'express';
import * as authController from '../controllers/authController';
import { auth } from '../middleware/auth';
import { registerValidation, loginValidation } from '../utils/validators';

const router = Router();

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/profile', auth, authController.getProfile);

export default router;


