import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { JWT_SECRET } from '../config/constants';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
      };

      // Verify user exists
      const user = await User.findByPk(decoded.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }

      // Check if user is locked
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        return res.status(423).json({
          success: false,
          error: 'Account is temporarily locked'
        });
      }

      req.user = {
        id: decoded.userId,
        email: decoded.email
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          error: 'Token expired'
        });
      }

      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
      };

      const user = await User.findByPk(decoded.userId);
      if (user) {
        req.user = {
          id: decoded.userId,
          email: decoded.email
        };
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }

    next();
  } catch (error) {
    next(error);
  }
};
