"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const route_1 = __importDefault(require("./features/auth/server/route"));
const route_2 = __importDefault(require("./features/members/server/route"));
const route_3 = __importDefault(require("./features/projects/server/route"));
const route_4 = __importDefault(require("./features/tasks/server/route"));
const route_5 = __importDefault(require("./features/workspaces/server/route"));
const app = new hono_1.Hono().basePath('/api');
// CORS configuration - Allow requests from the frontend
app.use('*', (0, cors_1.cors)({
    origin: (origin) => {
        // Allow local development frontend
        if (!origin || origin.startsWith('http://localhost:')) {
            return origin;
        }
        return origin;
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
}));
const routes = app
    .route('/auth', route_1.default)
    .route('/members', route_2.default)
    .route('/projects', route_3.default)
    .route('/tasks', route_4.default)
    .route('/workspaces', route_5.default);
const port = process.env.PORT ? parseInt(process.env.PORT) : 5001;
console.log(`Server is running on port ${port}`);
(0, node_server_1.serve)({
    fetch: app.fetch,
    port,
});
