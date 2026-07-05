import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

const AI_SERVICE_URL = (process.env.AI_SERVICE_URL || 'http://localhost:8000').trim();

const proxyToAI = async (endpoint: string, body: any) => {
  const response = await fetch(`${AI_SERVICE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return response.json();
};

// GET /api/ai/health
export const aiHealth = async (_req: Request, res: Response): Promise<void> => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/health`);
    if (response.ok) {
      res.json({ status: "online", service: "Evolvian AI Flow" });
    } else {
      res.json({ status: "offline", service: "Evolvian AI Flow" });
    }
  } catch {
    res.json({ status: "offline", service: "Evolvian AI Flow" });
  }
};

// POST /api/ai/predict/completion
export const predictCompletion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await proxyToAI('/predict/completion', req.body);
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// POST /api/ai/recommend/team
export const recommendTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await proxyToAI('/recommend/team', req.body);
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// POST /api/ai/analyze/performance
export const analyzePerformance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await proxyToAI('/analyze/performance', req.body);
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// POST /api/ai/generate/tasks
export const generateTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await proxyToAI('/generate/tasks', req.body);
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// POST /api/ai/plan/sprint
export const planSprint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await proxyToAI('/plan/sprint', req.body);
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// POST /api/ai/detect/risks
export const detectRisks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await proxyToAI('/detect/risks', req.body);
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// POST /api/ai/estimate/deadline
export const estimateDeadline = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await proxyToAI('/estimate/deadline', req.body);
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// POST /api/ai/chat
export const aiChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await proxyToAI('/chat', req.body);
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

// GET /api/ai/insights
export const getAiInsights = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/insights`);
    const data = await response.json();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};
