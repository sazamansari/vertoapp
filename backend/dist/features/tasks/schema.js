"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("./types");
exports.createTaskSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, 'Task name is required.'),
    status: zod_1.z.nativeEnum(types_1.TaskStatus, {
        required_error: 'Task status is required.',
    }),
    workspaceId: zod_1.z.string().trim().min(1, 'Workspace id is required.'),
    projectId: zod_1.z.string().trim().min(1, 'Project id is required.'),
    dueDate: zod_1.z.coerce.date(),
    assigneeId: zod_1.z.string().trim().min(1, 'Assignee id is required.'),
    description: zod_1.z.string().optional(),
});
//# sourceMappingURL=schema.js.map