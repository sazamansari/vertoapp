"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const ai_controller_1 = require("../controllers/ai.controller");
const router = (0, express_1.Router)();
router.get('/health', ai_controller_1.aiHealth);
router.post('/predict/completion', auth_middleware_1.authMiddleware, ai_controller_1.predictCompletion);
router.post('/recommend/team', auth_middleware_1.authMiddleware, ai_controller_1.recommendTeam);
router.post('/analyze/performance', auth_middleware_1.authMiddleware, ai_controller_1.analyzePerformance);
router.post('/generate/tasks', auth_middleware_1.authMiddleware, ai_controller_1.generateTasks);
router.post('/plan/sprint', auth_middleware_1.authMiddleware, ai_controller_1.planSprint);
router.post('/detect/risks', auth_middleware_1.authMiddleware, ai_controller_1.detectRisks);
router.post('/estimate/deadline', auth_middleware_1.authMiddleware, ai_controller_1.estimateDeadline);
router.post('/chat', auth_middleware_1.authMiddleware, ai_controller_1.aiChat);
exports.default = router;
//# sourceMappingURL=ai.routes.js.map