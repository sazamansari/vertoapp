import { z } from 'zod';
export declare const createWorkspaceSchema: z.ZodObject<{
    name: z.ZodString;
    image: z.ZodOptional<z.ZodUnion<[z.ZodType<import("buffer").File, z.ZodTypeDef, import("buffer").File>, z.ZodEffects<z.ZodString, string | undefined, string>]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    image?: string | import("buffer").File | undefined;
}, {
    name: string;
    image?: string | import("buffer").File | undefined;
}>;
export declare const updateWorkspaceSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodUnion<[z.ZodType<import("buffer").File, z.ZodTypeDef, import("buffer").File>, z.ZodEffects<z.ZodString, string | undefined, string>]>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    image?: string | import("buffer").File | undefined;
}, {
    name?: string | undefined;
    image?: string | import("buffer").File | undefined;
}>;
//# sourceMappingURL=schema.d.ts.map