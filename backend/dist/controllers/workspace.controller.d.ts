import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const getWorkspaces: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createWorkspace: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getWorkspace: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getWorkspaceInfo: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateWorkspace: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteWorkspace: (req: AuthRequest, res: Response) => Promise<void>;
export declare const resetInviteCode: (req: AuthRequest, res: Response) => Promise<void>;
export declare const joinWorkspace: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getWorkspaceAnalytics: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=workspace.controller.d.ts.map