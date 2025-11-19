import jwt from 'jsonwebtoken';
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN
} from '../config/constants';

export const generateAccessToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

export const generateRefreshToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN
  });
};

export const verifyAccessToken = (token: string): { userId: string; email: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
};

export const verifyRefreshToken = (token: string): { userId: string; email: string } => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string; email: string };
};
