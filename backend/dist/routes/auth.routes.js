"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
const resendOTPLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 requests per `window` (here, per 15 minutes)
    message: { error: 'Too many OTP requests from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});
router.get('/current', auth_middleware_1.authMiddleware, auth_controller_1.getCurrentUser);
router.patch('/profile', auth_middleware_1.authMiddleware, auth_controller_1.updateProfile);
router.post('/login', auth_controller_1.login);
router.post('/register', auth_controller_1.register);
router.post('/signup', auth_controller_1.register); // Alias for signup
router.post('/logout', auth_controller_1.logout);
router.post('/verify-otp', auth_controller_1.verifyOTP);
router.post('/resend-otp', resendOTPLimiter, auth_controller_1.resendOTP);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map