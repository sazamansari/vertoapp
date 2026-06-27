import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const aiHealth: (_req: Request, res: Response) => Promise<void>;
export declare const predictCompletion: (req: AuthRequest, res: Response) => Promise<void>;
export declare const recommendTeam: (req: AuthRequest, res: Response) => Promise<void>;
export declare const analyzePerformance: (req: AuthRequest, res: Response) => Promise<void>;
export declare const generateTasks: (req: AuthRequest, res: Response) => Promise<void>;
export declare const planSprint: (req: AuthRequest, res: Response) => Promise<void>;
export declare const detectRisks: (req: AuthRequest, res: Response) => Promise<void>;
export declare const estimateDeadline: (req: AuthRequest, res: Response) => Promise<void>;
export declare const aiChat: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAiInsights: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=ai.controller.d.ts.map