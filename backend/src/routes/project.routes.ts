import { Router } from 'express';
import multer from 'multer';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { requirePermission, Permission } from '../middleware/rbac.middleware';
import { Project } from '../models/Project';
import { createProject, getProjects, getProject, updateProject, deleteProject, getProjectAnalytics } from '../controllers/project.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const getProjectWorkspaceId = async (req: AuthRequest) => {
  const project = await Project.findById(req.params.projectId).lean();
  return project ? project.workspaceId.toString() : undefined;
};

router.get('/', authMiddleware, getProjects);
router.post('/', authMiddleware, upload.single('image'), requirePermission(Permission.CREATE_PROJECT), createProject);
router.get('/:projectId/analytics', authMiddleware, requirePermission(Permission.VIEW_ANALYTICS, getProjectWorkspaceId), getProjectAnalytics);
router.get('/:projectId', authMiddleware, getProject);
router.patch('/:projectId', authMiddleware, requirePermission(Permission.UPDATE_PROJECT, getProjectWorkspaceId), upload.single('image'), updateProject);
router.delete('/:projectId', authMiddleware, requirePermission(Permission.DELETE_PROJECT, getProjectWorkspaceId), deleteProject);

export default router;
