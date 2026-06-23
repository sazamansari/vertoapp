"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const workspace_routes_1 = __importDefault(require("./routes/workspace.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const member_routes_1 = __importDefault(require("./routes/member.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
// ── Middleware ──────────────────────────────────────────────
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow local development and any localhost port
        if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            callback(null, true);
        }
        else {
            callback(null, origin);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length'],
    maxAge: 600,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// ── Health ──────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth', auth_routes_1.default);
app.use('/api/workspaces', workspace_routes_1.default);
app.use('/api/projects', project_routes_1.default);
app.use('/api/tasks', task_routes_1.default);
app.use('/api/members', member_routes_1.default);
app.use('/api/ai', ai_routes_1.default);
// ── Error Handler ───────────────────────────────────────────
app.use(error_middleware_1.errorMiddleware);
// ── Start ───────────────────────────────────────────────────
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5001;
app.listen(PORT, () => {
    console.log(`✅ Express server running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map