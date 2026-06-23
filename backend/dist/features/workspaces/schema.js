"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkspaceSchema = exports.createWorkspaceSchema = void 0;
const zod_1 = require("zod");
exports.createWorkspaceSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, 'Workspace name is required.'),
    image: zod_1.z.union([zod_1.z.instanceof(File), zod_1.z.string().transform((value) => (value === '' ? undefined : value))]).optional(),
});
exports.updateWorkspaceSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, 'Workspace name must be 1 or more characters.').optional(),
    image: zod_1.z.union([zod_1.z.instanceof(File), zod_1.z.string().transform((value) => (value === '' ? undefined : value))]).optional(),
});
//# sourceMappingURL=schema.js.map