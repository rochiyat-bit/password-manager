import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.errors
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }

  if (err.name === 'ForbiddenError') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden'
    });
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      success: false,
      error: 'Resource not found'
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
