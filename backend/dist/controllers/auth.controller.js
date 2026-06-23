"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.register = exports.login = exports.getCurrentUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../lib/auth");
const mongoose_1 = __importDefault(require("../lib/mongoose"));
const User_1 = require("../models/User");
const constants_1 = require("../features/auth/constants");
const COOKIE_OPTIONS = {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
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
        const token = await (0, auth_1.signJwt)({ id: user._id.toString() });
        res.cookie(constants_1.AUTH_COOKIE, token, COOKIE_OPTIONS);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.login = login;
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
        const user = await User_1.User.create({ name, email, password: hashedPassword });
        const token = await (0, auth_1.signJwt)({ id: user._id.toString() });
        res.cookie(constants_1.AUTH_COOKIE, token, COOKIE_OPTIONS);
        res.json({ success: true });
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
//# sourceMappingURL=auth.controller.js.map