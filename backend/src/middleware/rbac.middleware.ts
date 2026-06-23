import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { Member } from '../models/Member';
import { MemberRole } from '../features/members/types';

export enum Permission {
  CREATE_WORKSPACE = 'CREATE_WORKSPACE',
  UPDATE_WORKSPACE = 'UPDATE_WORKSPACE',
  DELETE_WORKSPACE = 'DELETE_WORKSPACE',

  CREATE_PROJECT = 'CREATE_PROJECT',
  UPDATE_PROJECT = 'UPDATE_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',

  CREATE_TASK = 'CREATE_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',

  MANAGE_MEMBERS = 'MANAGE_MEMBERS',
  MANAGE_ROLES = 'MANAGE_ROLES',

  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  VIEW_REPORTS = 'VIEW_REPORTS',

  USE_AI = 'USE_AI',
  CONFIGURE_AI = 'CONFIGURE_AI',
}

export const ADMIN_PERMISSIONS = new Set(Object.values(Permission));

export const MEMBER_PERMISSIONS = new Set([
  Permission.CREATE_PROJECT,
  Permission.CREATE_TASK,
  Permission.UPDATE_TASK,
  Permission.USE_AI,
  Permission.VIEW_ANALYTICS, // Analytics relevant to workspace
]);

export const requirePermission = (permission: Permission, getWorkspaceId?: (req: AuthRequest) => Promise<string | undefined> | string | undefined) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      let workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;

      if (!workspaceId && getWorkspaceId) {
        workspaceId = await getWorkspaceId(req);
      }

      if (!workspaceId) {
        res.status(400).json({ error: 'workspaceId is required for RBAC' });
        return;
      }

      const member = await Member.findOne({ workspaceId, userId: req.user._id }).lean();

      if (!member) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const permissions = member.role === MemberRole.ADMIN ? ADMIN_PERMISSIONS : MEMBER_PERMISSIONS;

      if (!permissions.has(permission)) {
        res.status(403).json({ error: 'Forbidden.' });
        return;
      }

      // Attach member to request for downstream use (e.g., update task checks)
      req.member = member;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};

export const requireAdmin = requirePermission(Permission.MANAGE_MEMBERS);
