"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const workspace_controller_1 = require("../controllers/workspace.controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
router.get('/', auth_middleware_1.authMiddleware, workspace_controller_1.getWorkspaces);
router.post('/', auth_middleware_1.authMiddleware, upload.single('image'), workspace_controller_1.createWorkspace);
router.get('/:workspaceId', auth_middleware_1.authMiddleware, workspace_controller_1.getWorkspace);
router.get('/:workspaceId/info', auth_middleware_1.authMiddleware, workspace_controller_1.getWorkspaceInfo);
router.patch('/:workspaceId', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requirePermission)(rbac_middleware_1.Permission.UPDATE_WORKSPACE), upload.single('image'), workspace_controller_1.updateWorkspace);
router.delete('/:workspaceId', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requirePermission)(rbac_middleware_1.Permission.DELETE_WORKSPACE), workspace_controller_1.deleteWorkspace);
router.post('/:workspaceId/resetInviteCode', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requirePermission)(rbac_middleware_1.Permission.UPDATE_WORKSPACE), workspace_controller_1.resetInviteCode);
router.post('/:workspaceId/join', auth_middleware_1.authMiddleware, workspace_controller_1.joinWorkspace);
router.get('/:workspaceId/analytics', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requirePermission)(rbac_middleware_1.Permission.VIEW_ANALYTICS), workspace_controller_1.getWorkspaceAnalytics);
exports.default = router;
//# sourceMappingURL=workspace.routes.js.map