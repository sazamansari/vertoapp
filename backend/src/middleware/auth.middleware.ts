import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../lib/auth';
import connectToDatabase from '../lib/mongoose';
import { User } from '../models/User';
import { AUTH_COOKIE } from '../features/auth/constants';

export interface AuthRequest extends Request {
  user?: any;
  member?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies[AUTH_COOKIE];

    if (!token) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const payload = await verifyJwt(token);

    if (!payload || !payload.id) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    await connectToDatabase();
    const user = await User.findById(payload.id).lean();

    if (!user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized.' });
  }
};
