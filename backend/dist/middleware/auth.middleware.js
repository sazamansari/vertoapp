"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_1 = require("../lib/auth");
const mongoose_1 = __importDefault(require("../lib/mongoose"));
const User_1 = require("../models/User");
const constants_1 = require("../features/auth/constants");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies[constants_1.AUTH_COOKIE];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        const payload = await (0, auth_1.verifyJwt)(token);
        if (!payload || !payload.id) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        await (0, mongoose_1.default)();
        const user = await User_1.User.findById(payload.id).lean();
        if (!user) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        req.user = user;
        next();
    }
    catch {
        res.status(401).json({ error: 'Unauthorized.' });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map