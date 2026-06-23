"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpFormSchema = exports.signInFormSchema = void 0;
const zod_1 = require("zod");
exports.signInFormSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email({
        message: 'Invalid email.',
    }),
    password: zod_1.z.string({
        required_error: 'Password is required.',
    }),
});
exports.signUpFormSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, 'Full name is required.'),
    email: zod_1.z.string().trim().min(1, 'Email is required.').email({
        message: 'Invalid email.',
    }),
    password: zod_1.z.string().min(8, 'Password must be atleast 8 characters.').max(256, 'Password cannot exceed 256 characters.'),
});
//# sourceMappingURL=schema.js.map