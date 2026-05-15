import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import crypto from 'crypto';
import { PaymentService } from '../services/paymentService';
import { AuditService } from '../services/auditService';

const generateToken = (id: string, type: 'access' | 'refresh') => {
  const secret = process.env.JWT_SECRET || 'secret';
  const expiresIn = type === 'access' ? '1d' : '7d';
  return jwt.sign({ id }, secret, { expiresIn });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { 
      email, password, fullName, companyName, 
      role, agencyWebsite, teamSize, location 
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Razorpay verification for Agency
    if (role === 'AGENCY') {
      const { paymentResponse } = req.body;
      if (!paymentResponse) {
        return res.status(400).json({ success: false, message: 'Agency registration requires payment' });
      }

      const isVerified = PaymentService.verifySignature(
        paymentResponse.razorpay_order_id,
        paymentResponse.razorpay_payment_id,
        paymentResponse.razorpay_signature
      );

      if (!isVerified) {
        return res.status(400).json({ success: false, message: 'Payment verification failed' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      passwordHash,
      fullName,
      companyName,
      role: role || 'USER',
      plan: role === 'AGENCY' ? 'AGENCY' : 'FREE',
      agencyWebsite,
      teamSize,
      location,
    });

    if (role === 'AGENCY') {
      await AuditService.log(user._id.toString(), 'AGENCY_REGISTRATION_PAYMENT', 'Agency account created with verified payment', req.ip);
    }

    const accessToken = generateToken(user._id.toString(), 'access');
    const refreshToken = generateToken(user._id.toString(), 'refresh');

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.role === 'AGENCY' && user.activeSessions.length >= 5) {
      return res.status(403).json({ 
        success: false, 
        message: 'Maximum device limit reached. Please contact helpdesk to increase your limit.' 
      });
    }

    const sessionId = crypto.randomUUID();
    user.activeSessions.push(sessionId);
    user.lastLogin = new Date();
    await user.save();

    const accessToken = generateToken(user._id.toString(), 'access');
    const refreshToken = generateToken(user._id.toString(), 'refresh');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        sessionId, // Send this back so client can send it in logout
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded: any = jwt.verify(refreshToken, process.env.JWT_SECRET || 'secret');
    
    const newAccessToken = generateToken(decoded.id, 'access');
    const newRefreshToken = generateToken(decoded.id, 'refresh');

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

export const me = async (req: any, res: Response) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        companyName: user.companyName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req: any, res: Response) => {
  try {
    const { sessionId } = req.body;
    const user = await User.findById(req.user?._id);
    if (user && sessionId) {
      user.activeSessions = user.activeSessions.filter(id => id !== sessionId);
      await user.save();
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.json({ success: true, message: 'Logged out successfully' });
  }
};
