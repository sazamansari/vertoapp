"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const project_controller_1 = require("../controllers/project.controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
router.get('/', auth_middleware_1.authMiddleware, project_controller_1.getProjects);
router.post('/', auth_middleware_1.authMiddleware, upload.single('image'), project_controller_1.createProject);
router.get('/:projectId/analytics', auth_middleware_1.authMiddleware, project_controller_1.getProjectAnalytics);
router.get('/:projectId', auth_middleware_1.authMiddleware, project_controller_1.getProject);
router.patch('/:projectId', auth_middleware_1.authMiddleware, upload.single('image'), project_controller_1.updateProject);
router.delete('/:projectId', auth_middleware_1.authMiddleware, project_controller_1.deleteProject);
exports.default = router;
//# sourceMappingURL=project.routes.js.map