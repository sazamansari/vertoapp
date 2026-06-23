"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_validator_1 = require("@hono/zod-validator");
const hono_1 = require("hono");
const cookie_1 = require("hono/cookie");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const constants_1 = require("../constants");
const schema_1 = require("../schema");
const session_middleware_1 = require("../../../lib/session-middleware");
const mongoose_1 = __importDefault(require("../../../lib/mongoose"));
const User_1 = require("../../../models/User");
const auth_1 = require("../../../lib/auth");
const app = new hono_1.Hono()
    .get('/current', session_middleware_1.sessionMiddleware, (ctx) => {
    const user = ctx.get('user');
    return ctx.json({ data: { $id: user._id.toString(), name: user.name, email: user.email } });
})
    .post('/login', (0, zod_validator_1.zValidator)('json', schema_1.signInFormSchema), async (ctx) => {
    const { email, password } = ctx.req.valid('json');
    await (0, mongoose_1.default)();
    const user = await User_1.User.findOne({ email });
    if (!user || !user.password) {
        return ctx.json({ error: 'Invalid email or password' }, 401);
    }
    const isValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isValid) {
        return ctx.json({ error: 'Invalid email or password' }, 401);
    }
    const token = await (0, auth_1.signJwt)({ id: user._id.toString() });
    (0, cookie_1.setCookie)(ctx, constants_1.AUTH_COOKIE, token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return ctx.json({ success: true });
})
    .post('/register', (0, zod_validator_1.zValidator)('json', schema_1.signUpFormSchema), async (ctx) => {
    const { name, email, password } = ctx.req.valid('json');
    await (0, mongoose_1.default)();
    const existingUser = await User_1.User.findOne({ email });
    if (existingUser) {
        return ctx.json({ error: 'User already exists' }, 409);
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await User_1.User.create({
        name,
        email,
        password: hashedPassword,
    });
    const token = await (0, auth_1.signJwt)({ id: user._id.toString() });
    (0, cookie_1.setCookie)(ctx, constants_1.AUTH_COOKIE, token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return ctx.json({ success: true });
})
    .post('/logout', session_middleware_1.sessionMiddleware, async (ctx) => {
    (0, cookie_1.deleteCookie)(ctx, constants_1.AUTH_COOKIE);
    return ctx.json({ success: true });
});
exports.default = app;
