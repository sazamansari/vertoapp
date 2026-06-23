"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const cookie_1 = require("hono/cookie");
const factory_1 = require("hono/factory");
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../features/auth/constants");
const auth_1 = require("./auth");
const mongoose_2 = __importDefault(require("./mongoose"));
const User_1 = require("../models/User");
exports.sessionMiddleware = (0, factory_1.createMiddleware)(async (ctx, next) => {
    const session = (0, cookie_1.getCookie)(ctx, constants_1.AUTH_COOKIE);
    if (!session) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
    }
    const payload = await (0, auth_1.verifyJwt)(session);
    if (!payload || !payload.id || typeof payload.id !== 'string' || !mongoose_1.default.Types.ObjectId.isValid(payload.id)) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
    }
    await (0, mongoose_2.default)();
    const user = await User_1.User.findById(payload.id).select('-password');
    if (!user) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
    }
    ctx.set('user', user);
    await next();
});
