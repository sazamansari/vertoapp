import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermission, Permission } from '../middleware/rbac.middleware';
import {
  aiHealth, getAiInsights, predictCompletion, recommendTeam, analyzePerformance,
  generateTasks, planSprint, detectRisks, estimateDeadline, aiChat,
} from '../controllers/ai.controller';

const router = Router();

router.get('/health', aiHealth);
router.get('/insights', authMiddleware, requirePermission(Permission.USE_AI), getAiInsights);
router.post('/predict/completion', authMiddleware, requirePermission(Permission.USE_AI), predictCompletion);
router.post('/recommend/team', authMiddleware, requirePermission(Permission.USE_AI), recommendTeam);
router.post('/analyze/performance', authMiddleware, requirePermission(Permission.VIEW_ANALYTICS), analyzePerformance);
router.post('/generate/tasks', authMiddleware, requirePermission(Permission.USE_AI), generateTasks);
router.post('/plan/sprint', authMiddleware, requirePermission(Permission.USE_AI), planSprint);
router.post('/detect/risks', authMiddleware, requirePermission(Permission.USE_AI), detectRisks);
router.post('/estimate/deadline', authMiddleware, requirePermission(Permission.USE_AI), estimateDeadline);
router.post('/chat', authMiddleware, requirePermission(Permission.USE_AI), aiChat);

export default router;
