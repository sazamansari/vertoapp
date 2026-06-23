"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectSchema = exports.createProjectSchema = void 0;
const zod_1 = require("zod");
exports.createProjectSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, 'Project name is required.'),
    image: zod_1.z.union([zod_1.z.instanceof(File), zod_1.z.string().transform((value) => (value === '' ? undefined : value))]).optional(),
    workspaceId: zod_1.z.string({
        message: 'Workspace id is required.',
    }),
});
exports.updateProjectSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, 'Project name is required.').optional(),
    image: zod_1.z.union([zod_1.z.instanceof(File), zod_1.z.string().transform((value) => (value === '' ? undefined : value))]).optional(),
    workspaceId: zod_1.z.string({
        message: 'Workspace id is required.',
    }),
});
//# sourceMappingURL=schema.js.map