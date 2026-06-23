import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getCurrentUser, login, register, logout, updateProfile } from '../controllers/auth.controller';

const router = Router();

router.get('/current', authMiddleware, getCurrentUser);
router.patch('/profile', authMiddleware, updateProfile);
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

export default router;
