import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const getCurrentUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const logout: (_req: Request, res: Response) => Promise<void>;
export declare const updateProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const verifyOTP: (req: Request, res: Response) => Promise<void>;
export declare const resendOTP: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map