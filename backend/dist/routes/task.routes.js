"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const Task_1 = require("../models/Task");
const task_controller_1 = require("../controllers/task.controller");
const router = (0, express_1.Router)();
const getTaskWorkspaceId = async (req) => {
    const task = await Task_1.Task.findById(req.params.taskId).lean();
    return task ? task.workspaceId.toString() : undefined;
};
router.get('/', auth_middleware_1.authMiddleware, task_controller_1.getTasks);
router.post('/bulk-update', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requirePermission)(rbac_middleware_1.Permission.UPDATE_TASK), task_controller_1.bulkUpdateTasks);
router.get('/:taskId', auth_middleware_1.authMiddleware, task_controller_1.getTask);
router.post('/', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requirePermission)(rbac_middleware_1.Permission.CREATE_TASK), task_controller_1.createTask);
router.patch('/:taskId', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requirePermission)(rbac_middleware_1.Permission.UPDATE_TASK, getTaskWorkspaceId), task_controller_1.updateTask);
router.delete('/:taskId', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requirePermission)(rbac_middleware_1.Permission.DELETE_TASK, getTaskWorkspaceId), task_controller_1.deleteTask);
exports.default = router;
//# sourceMappingURL=task.routes.js.map