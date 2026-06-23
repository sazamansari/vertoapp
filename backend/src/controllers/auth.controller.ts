import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { signJwt } from '../lib/auth';
import connectToDatabase from '../lib/mongoose';
import { User } from '../models/User';
import { AUTH_COOKIE } from '../features/auth/constants';
import { AuthRequest } from '../middleware/auth.middleware';

const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days in ms
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    res.json({
      data: {
        $id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user || !user.password) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = await signJwt({ id: user._id.toString() });

    res.cookie(AUTH_COOKIE, token, COOKIE_OPTIONS);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters.' });
      return;
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = await signJwt({ id: user._id.toString() });

    res.cookie(AUTH_COOKIE, token, COOKIE_OPTIONS);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie(AUTH_COOKIE, { path: '/' });
  res.json({ success: true });
};
