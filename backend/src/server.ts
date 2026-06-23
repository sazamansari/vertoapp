import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.routes';
import workspaceRoutes from './routes/workspace.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import memberRoutes from './routes/member.routes';
import aiRoutes from './routes/ai.routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow local development and any localhost port
    if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      callback(null, true);
    } else {
      callback(null, origin);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length'],
  maxAge: 600,
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Health ──────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/ai', aiRoutes);

// ── Error Handler ───────────────────────────────────────────
app.use(errorMiddleware);

// ── Start ───────────────────────────────────────────────────
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5001;

app.listen(PORT, () => {
  console.log(`✅ Express server running on port ${PORT}`);
});

export default app;
