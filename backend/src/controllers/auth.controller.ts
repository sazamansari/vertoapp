import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { signJwt } from '../lib/auth';
import connectToDatabase from '../lib/mongoose';
import { User } from '../models/User';
import { OTP } from '../models/OTP';
import { EmailService } from '../services/EmailService';
import { AUTH_COOKIE } from '../features/auth/constants';
import { AuthRequest } from '../middleware/auth.middleware';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
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
        imageUrl: user.imageUrl,
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

    if (!user.isVerified) {
      res.status(401).json({ error: 'Email not verified. Please verify your email first.', requiresVerification: true, userId: user._id.toString() });
      return;
    }

    const token = await signJwt({ id: user._id.toString() });

    res.cookie(AUTH_COOKIE, token, COOKIE_OPTIONS);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

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
      if (existingUser.isVerified) {
        res.status(409).json({ error: 'User already exists' });
        return;
      }

      // User exists but is not verified, update details and resend OTP
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.name = name;
      existingUser.password = hashedPassword;
      await existingUser.save();

      await OTP.deleteMany({ userId: existingUser._id });

      const otp = generateOTP();
      const hashedOTP = await bcrypt.hash(otp, 10);

      await OTP.create({
        userId: existingUser._id,
        otp: hashedOTP,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      });

      await EmailService.sendOTPEmail(existingUser.email, existingUser.name, otp);

      res.json({ success: true, message: 'OTP sent to email', userId: existingUser._id.toString() });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, isVerified: false });

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    await OTP.create({
      userId: user._id,
      otp: hashedOTP,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    await EmailService.sendOTPEmail(user.email, user.name, otp);

    res.json({ success: true, message: 'OTP sent to email', userId: user._id.toString() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie(AUTH_COOKIE, { path: '/' });
  res.json({ success: true });
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { name, imageUrl } = req.body;

    await connectToDatabase();
    const user = await User.findByIdAndUpdate(userId, { name, imageUrl }, { new: true });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        $id: user._id.toString(),
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      res.status(400).json({ error: 'User ID and OTP are required' });
      return;
    }

    await connectToDatabase();
    
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const otpRecord = await OTP.findOne({ userId }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      res.status(400).json({ error: 'OTP expired or invalid' });
      return;
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otp);
    
    if (!isValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }

    // Mark user as verified
    user.isVerified = true;
    await user.save();
    
    // Delete OTP record
    await OTP.deleteMany({ userId });

    // Login user automatically
    const token = await signJwt({ id: user._id.toString() });
    res.cookie(AUTH_COOKIE, token, COOKIE_OPTIONS);
    
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    await connectToDatabase();
    
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ error: 'User already verified' });
      return;
    }

    // Delete existing OTPs
    await OTP.deleteMany({ userId });

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    await OTP.create({
      userId: user._id,
      otp: hashedOTP,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    await EmailService.sendOTPEmail(user.email, user.name, otp);

    res.json({ success: true, message: 'New OTP sent to email' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential, accessToken } = req.body;

    if (!credential && !accessToken) {
      res.status(400).json({ error: 'Google credential or accessToken is required' });
      return;
    }

    let email: string, name: string | undefined, picture: string | undefined;

    if (credential) {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        res.status(400).json({ error: 'Invalid Google token payload' });
        return;
      }
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    } else if (accessToken) {
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (!data.email) {
        res.status(400).json({ error: 'Invalid Google access token payload' });
        return;
      }
      email = data.email;
      name = data.name;
      picture = data.picture;
    } else {
      res.status(400).json({ error: 'Invalid token provided' });
      return;
    }

    await connectToDatabase();
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with random password since they logged in via Google
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await User.create({
        name: name || 'Google User',
        email,
        password: hashedPassword,
        isVerified: true,
        imageUrl: picture,
      });
    } else {
      // If user exists but is not verified, verify them
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
      
      // Update missing fields if needed
      if (!user.imageUrl && picture) {
        user.imageUrl = picture;
        await user.save();
      }
    }

    const token = await signJwt({ id: user._id.toString() });
    res.cookie(AUTH_COOKIE, token, COOKIE_OPTIONS);
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Google login error:', error);
    res.status(500).json({ error: error.message });
  }
};
