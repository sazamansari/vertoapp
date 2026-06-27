"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOTP = exports.verifyOTP = exports.updateProfile = exports.logout = exports.register = exports.login = exports.getCurrentUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../lib/auth");
const mongoose_1 = __importDefault(require("../lib/mongoose"));
const User_1 = require("../models/User");
const OTP_1 = require("../models/OTP");
const EmailService_1 = require("../services/EmailService");
const constants_1 = require("../features/auth/constants");
const COOKIE_OPTIONS = {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days in ms
};
const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
        res.json({
            data: {
                $id: user._id.toString(),
                name: user.name,
                email: user.email,
                imageUrl: user.imageUrl,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCurrentUser = getCurrentUser;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required.' });
            return;
        }
        await (0, mongoose_1.default)();
        const user = await User_1.User.findOne({ email });
        if (!user || !user.password) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        if (!user.isVerified) {
            res.status(401).json({ error: 'Email not verified. Please verify your email first.', requiresVerification: true, userId: user._id.toString() });
            return;
        }
        const token = await (0, auth_1.signJwt)({ id: user._id.toString() });
        res.cookie(constants_1.AUTH_COOKIE, token, COOKIE_OPTIONS);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.login = login;
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ error: 'Name, email, and password are required.' });
            return;
        }
        if (password.length < 8) {
            res.status(400).json({ error: 'Password must be at least 8 characters.' });
            return;
        }
        await (0, mongoose_1.default)();
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ error: 'User already exists' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.User.create({ name, email, password: hashedPassword, isVerified: false });
        const otp = generateOTP();
        const hashedOTP = await bcryptjs_1.default.hash(otp, 10);
        await OTP_1.OTP.create({
            userId: user._id,
            otp: hashedOTP,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        });
        await EmailService_1.EmailService.sendOTPEmail(user.email, user.name, otp);
        res.json({ success: true, message: 'OTP sent to email', userId: user._id.toString() });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.register = register;
const logout = async (_req, res) => {
    res.clearCookie(constants_1.AUTH_COOKIE, { path: '/' });
    res.json({ success: true });
};
exports.logout = logout;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, imageUrl } = req.body;
        await (0, mongoose_1.default)();
        const user = await User_1.User.findByIdAndUpdate(userId, { name, imageUrl }, { new: true });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({
            success: true,
            data: {
                $id: user._id.toString(),
                name: user.name,
                email: user.email,
                imageUrl: user.imageUrl,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateProfile = updateProfile;
const verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        if (!userId || !otp) {
            res.status(400).json({ error: 'User ID and OTP are required' });
            return;
        }
        await (0, mongoose_1.default)();
        const user = await User_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const otpRecord = await OTP_1.OTP.findOne({ userId }).sort({ createdAt: -1 });
        if (!otpRecord) {
            res.status(400).json({ error: 'OTP expired or invalid' });
            return;
        }
        const isValid = await bcryptjs_1.default.compare(otp, otpRecord.otp);
        if (!isValid) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            res.status(400).json({ error: 'Invalid OTP' });
            return;
        }
        // Mark user as verified
        user.isVerified = true;
        await user.save();
        // Delete OTP record
        await OTP_1.OTP.deleteMany({ userId });
        // Login user automatically
        const token = await (0, auth_1.signJwt)({ id: user._id.toString() });
        res.cookie(constants_1.AUTH_COOKIE, token, COOKIE_OPTIONS);
        res.json({ success: true, message: 'Email verified successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.verifyOTP = verifyOTP;
const resendOTP = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }
        await (0, mongoose_1.default)();
        const user = await User_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        if (user.isVerified) {
            res.status(400).json({ error: 'User already verified' });
            return;
        }
        // Delete existing OTPs
        await OTP_1.OTP.deleteMany({ userId });
        const otp = generateOTP();
        const hashedOTP = await bcryptjs_1.default.hash(otp, 10);
        await OTP_1.OTP.create({
            userId: user._id,
            otp: hashedOTP,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        });
        await EmailService_1.EmailService.sendOTPEmail(user.email, user.name, otp);
        res.json({ success: true, message: 'New OTP sent to email' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.resendOTP = resendOTP;
//# sourceMappingURL=auth.controller.js.map