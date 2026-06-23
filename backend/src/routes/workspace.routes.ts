import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermission, Permission } from '../middleware/rbac.middleware';
import {
  getWorkspaces, createWorkspace, getWorkspace, getWorkspaceInfo,
  updateWorkspace, deleteWorkspace, resetInviteCode, joinWorkspace, getWorkspaceAnalytics,
} from '../controllers/workspace.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', authMiddleware, getWorkspaces);
router.post('/', authMiddleware, upload.single('image'), createWorkspace);
router.get('/:workspaceId', authMiddleware, getWorkspace);
router.get('/:workspaceId/info', authMiddleware, getWorkspaceInfo);
router.patch('/:workspaceId', authMiddleware, requirePermission(Permission.UPDATE_WORKSPACE), upload.single('image'), updateWorkspace);
router.delete('/:workspaceId', authMiddleware, requirePermission(Permission.DELETE_WORKSPACE), deleteWorkspace);
router.post('/:workspaceId/resetInviteCode', authMiddleware, requirePermission(Permission.UPDATE_WORKSPACE), resetInviteCode);
router.post('/:workspaceId/join', authMiddleware, joinWorkspace);
router.get('/:workspaceId/analytics', authMiddleware, requirePermission(Permission.VIEW_ANALYTICS), getWorkspaceAnalytics);

export default router;
