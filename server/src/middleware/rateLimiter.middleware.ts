import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from '../config/redis';
import { RATE_LIMIT_WINDOW, RATE_LIMIT_MAX } from '../config/constants';

export const apiLimiter = rateLimit({
  store: new RedisStore({
    // @ts-ignore
    client: redis,
    prefix: 'rl:api:'
  }),
  windowMs: RATE_LIMIT_WINDOW,
  max: RATE_LIMIT_MAX,
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const authLimiter = rateLimit({
  store: new RedisStore({
    // @ts-ignore
    client: redis,
    prefix: 'rl:auth:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const passwordResetLimiter = rateLimit({
  store: new RedisStore({
    // @ts-ignore
    client: redis,
    prefix: 'rl:reset:'
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: {
    success: false,
    error: 'Too many password reset attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
