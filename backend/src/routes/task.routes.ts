import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { requirePermission, Permission } from '../middleware/rbac.middleware';
import { Task } from '../models/Task';
import { getTasks, getTask, createTask, updateTask, deleteTask, bulkUpdateTasks } from '../controllers/task.controller';

const router = Router();

const getTaskWorkspaceId = async (req: AuthRequest) => {
  const task = await Task.findById(req.params.taskId).lean();
  return task ? task.workspaceId.toString() : undefined;
};

router.get('/', authMiddleware, getTasks);
router.post('/bulk-update', authMiddleware, requirePermission(Permission.UPDATE_TASK), bulkUpdateTasks);
router.get('/:taskId', authMiddleware, getTask);
router.post('/', authMiddleware, requirePermission(Permission.CREATE_TASK), createTask);
router.patch('/:taskId', authMiddleware, requirePermission(Permission.UPDATE_TASK, getTaskWorkspaceId), updateTask);
router.delete('/:taskId', authMiddleware, requirePermission(Permission.DELETE_TASK, getTaskWorkspaceId), deleteTask);

export default router;
