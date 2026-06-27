import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authMiddleware } from '../middleware/auth.middleware';
import { getCurrentUser, login, register, logout, updateProfile, verifyOTP, resendOTP } from '../controllers/auth.controller';

const router = Router();

const resendOTPLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per `window` (here, per 15 minutes)
  message: { error: 'Too many OTP requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/current', authMiddleware, getCurrentUser);
router.patch('/profile', authMiddleware, updateProfile);
router.post('/login', login);
router.post('/register', register);
router.post('/signup', register); // Alias for signup
router.post('/logout', logout);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTPLimiter, resendOTP);

export default router;
