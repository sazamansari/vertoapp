"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const task_controller_1 = require("../controllers/task.controller");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, task_controller_1.getTasks);
router.post('/bulk-update', auth_middleware_1.authMiddleware, task_controller_1.bulkUpdateTasks);
router.get('/:taskId', auth_middleware_1.authMiddleware, task_controller_1.getTask);
router.post('/', auth_middleware_1.authMiddleware, task_controller_1.createTask);
router.patch('/:taskId', auth_middleware_1.authMiddleware, task_controller_1.updateTask);
router.delete('/:taskId', auth_middleware_1.authMiddleware, task_controller_1.deleteTask);
exports.default = router;
//# sourceMappingURL=task.routes.js.map