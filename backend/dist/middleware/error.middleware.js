"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (err, _req, res, _next) => {
    console.error('[ERROR]', err.message);
    res.status(500).json({ error: err.message || 'Internal server error' });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map