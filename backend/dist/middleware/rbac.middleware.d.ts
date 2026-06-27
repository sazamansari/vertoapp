import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
export declare enum Permission {
    CREATE_WORKSPACE = "CREATE_WORKSPACE",
    UPDATE_WORKSPACE = "UPDATE_WORKSPACE",
    DELETE_WORKSPACE = "DELETE_WORKSPACE",
    CREATE_PROJECT = "CREATE_PROJECT",
    UPDATE_PROJECT = "UPDATE_PROJECT",
    DELETE_PROJECT = "DELETE_PROJECT",
    CREATE_TASK = "CREATE_TASK",
    UPDATE_TASK = "UPDATE_TASK",
    DELETE_TASK = "DELETE_TASK",
    MANAGE_MEMBERS = "MANAGE_MEMBERS",
    MANAGE_ROLES = "MANAGE_ROLES",
    VIEW_ANALYTICS = "VIEW_ANALYTICS",
    VIEW_REPORTS = "VIEW_REPORTS",
    USE_AI = "USE_AI",
    CONFIGURE_AI = "CONFIGURE_AI"
}
export declare const ADMIN_PERMISSIONS: Set<Permission>;
export declare const MEMBER_PERMISSIONS: Set<Permission>;
export declare const requirePermission: (permission: Permission, getWorkspaceId?: (req: AuthRequest) => Promise<string | undefined> | string | undefined) => (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireAdmin: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=rbac.middleware.d.ts.map