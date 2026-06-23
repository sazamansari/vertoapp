import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getCurrentUser, login, register, logout } from '../controllers/auth.controller';

const router = Router();

router.get('/current', authMiddleware, getCurrentUser);
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

export default router;
