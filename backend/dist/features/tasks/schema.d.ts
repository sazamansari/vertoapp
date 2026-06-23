import { z } from 'zod';
import { TaskStatus } from './types';
export declare const createTaskSchema: z.ZodObject<{
    name: z.ZodString;
    status: z.ZodNativeEnum<typeof TaskStatus>;
    workspaceId: z.ZodString;
    projectId: z.ZodString;
    dueDate: z.ZodDate;
    assigneeId: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    workspaceId: string;
    status: TaskStatus;
    projectId: string;
    dueDate: Date;
    assigneeId: string;
    description?: string | undefined;
}, {
    name: string;
    workspaceId: string;
    status: TaskStatus;
    projectId: string;
    dueDate: Date;
    assigneeId: string;
    description?: string | undefined;
}>;
//# sourceMappingURL=schema.d.ts.map