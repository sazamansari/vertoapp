"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAiInsights = exports.aiChat = exports.estimateDeadline = exports.detectRisks = exports.planSprint = exports.generateTasks = exports.analyzePerformance = exports.recommendTeam = exports.predictCompletion = exports.aiHealth = void 0;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const proxyToAI = async (endpoint, body) => {
    const response = await fetch(`${AI_SERVICE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return response.json();
};
// GET /api/ai/health
const aiHealth = async (_req, res) => {
    try {
        const response = await fetch(`${AI_SERVICE_URL}/health`);
        if (response.ok) {
            res.json({ status: "online", service: "Evolvian AI Flow" });
        }
        else {
            res.json({ status: "offline", service: "Evolvian AI Flow" });
        }
    }
    catch {
        res.json({ status: "offline", service: "Evolvian AI Flow" });
    }
};
exports.aiHealth = aiHealth;
// POST /api/ai/predict/completion
const predictCompletion = async (req, res) => {
    try {
        const data = await proxyToAI('/predict/completion', req.body);
        res.json(data);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.predictCompletion = predictCompletion;
// POST /api/ai/recommend/team
const recommendTeam = async (req, res) => {
    try {
        const data = await proxyToAI('/recommend/team', req.body);
        res.json(data);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.recommendTeam = recommendTeam;
// POST /api/ai/analyze/performance
const analyzePerformance = async (req, res) => {
    try {
        const data = await proxyToAI('/analyze/performance', req.body);
        res.json(data);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.analyzePerformance = analyzePerformance;
// POST /api/ai/generate/tasks
const generateTasks = async (req, res) => {
    try {
        const data = await proxyToAI('/generate/tasks', req.body);
        res.json(data);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.generateTasks = generateTasks;
// POST /api/ai/plan/sprint
const planSprint = async (req, res) => {
    try {
        const data = await proxyToAI('/plan/sprint', req.body);
        res.json(data);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.planSprint = planSprint;
// POST /api/ai/detect/risks
const detectRisks = async (req, res) => {
    try {
        const data = await proxyToAI('/detect/risks', req.body);
        res.json(data);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.detectRisks = detectRisks;
// POST /api/ai/estimate/deadline
const estimateDeadline = async (req, res) => {
    try {
        const data = await proxyToAI('/estimate/deadline', req.body);
        res.json(data);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.estimateDeadline = estimateDeadline;
// POST /api/ai/chat
const aiChat = async (req, res) => {
    try {
        const data = await proxyToAI('/chat', req.body);
        res.json(data);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.aiChat = aiChat;
// GET /api/ai/insights
const getAiInsights = async (req, res) => {
    try {
        const response = await fetch(`${AI_SERVICE_URL}/insights`);
        const data = await response.json();
        res.json(data);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.getAiInsights = getAiInsights;
//# sourceMappingURL=ai.controller.js.map