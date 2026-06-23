import { z } from 'zod';
export declare const createProjectSchema: z.ZodObject<{
    name: z.ZodString;
    image: z.ZodOptional<z.ZodUnion<[z.ZodType<import("buffer").File, z.ZodTypeDef, import("buffer").File>, z.ZodEffects<z.ZodString, string | undefined, string>]>>;
    workspaceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    workspaceId: string;
    image?: string | import("buffer").File | undefined;
}, {
    name: string;
    workspaceId: string;
    image?: string | import("buffer").File | undefined;
}>;
export declare const updateProjectSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodUnion<[z.ZodType<import("buffer").File, z.ZodTypeDef, import("buffer").File>, z.ZodEffects<z.ZodString, string | undefined, string>]>>;
    workspaceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    workspaceId: string;
    name?: string | undefined;
    image?: string | import("buffer").File | undefined;
}, {
    workspaceId: string;
    name?: string | undefined;
    image?: string | import("buffer").File | undefined;
}>;
//# sourceMappingURL=schema.d.ts.map