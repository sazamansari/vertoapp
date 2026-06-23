import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const getMembers: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteMember: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateMember: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=member.controller.d.ts.map