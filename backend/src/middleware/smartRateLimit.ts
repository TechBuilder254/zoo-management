import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { Request, Response, NextFunction } from 'express';

// Extend Request interface to include rate limiting properties
declare global {
  namespace Express {
    interface Request {
      rateLimit?: {
        limit: number;
        remaining: number;
        resetTime: number;
      };
      slowDown?: {
        limit: number;
        current: number;
        remaining: number;
      };
      files?: any; // For file upload detection
    }
  }
}

/**
 * Smart rate limiting that only limits:
 * 1. Authorized write operations (POST, PUT, DELETE from authenticated users)
 * 2. Excessive login attempts (more than 10 per 15 minutes)
 * 
 * NO LIMITS on:
 * - Admin operations
 * - Search operations
 * - General website browsing (GET requests)
 * - Public read operations
 */

// Custom IP key generator function
const getIPKey = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]) : req.connection.remoteAddress || req.socket.remoteAddress;
  return ip || 'unknown';
};

// Rate limiter for authorized write operations only
export const authorizedWriteLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit authenticated users to 50 write requests per windowMs
  message: {
    error: 'Too many write requests from this user, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Only apply to authenticated users doing write operations
  skip: (req) => {
    const user = (req as any).user;
    return !user?.id || // Skip if not authenticated
           req.method === 'GET' || req.method === 'HEAD' || // Skip read operations
           req.path.includes('/admin/') || // Skip admin operations
           req.path.includes('/auth/') || // Skip auth operations (handled separately)
           req.path.includes('/search'); // Skip search operations
  },
  // Only rate limit authenticated users
  keyGenerator: (req) => {
    const user = (req as any).user;
    if (user?.id) {
      return `auth_write:user:${user.id}`; // Rate limit per authenticated user
    }
    return 'skip'; // Skip non-authenticated users
  },
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many write requests',
      message: 'Please slow down your data modification requests. You can still browse freely.',
      retryAfter: Math.round(req.rateLimit?.resetTime ? (req.rateLimit.resetTime - Date.now()) / 1000 : 900)
    });
  }
});

// REMOVED: Sensitive write limiting - handled by authorized write limiter

// REMOVED: Slow down middleware - not needed with selective rate limiting

// Special rate limiter for authentication endpoints - allows 10 attempts
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Allow 10 login attempts per windowMs (more generous)
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use email + IP for more specific limiting
    const email = req.body?.email || req.body?.username || 'unknown';
    return `auth:${email}:${getIPKey(req)}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many login attempts',
      message: 'Please wait before trying to login again.',
      retryAfter: Math.round(req.rateLimit?.resetTime ? (req.rateLimit.resetTime - Date.now()) / 1000 : 900)
    });
  }
});

// Rate limiter for file uploads - more generous for authenticated users
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Allow 20 uploads per hour (more generous)
  message: {
    error: 'Too many file uploads',
    message: 'Please wait before uploading more files.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip admin uploads and non-authenticated users
  skip: (req) => {
    const user = (req as any).user;
    return !user?.id || req.path.includes('/admin/');
  },
  keyGenerator: (req) => {
    const user = (req as any).user;
    if (user?.id) {
      return `upload:user:${user.id}`;
    }
    return 'skip'; // Skip non-authenticated users
  }
});

// NO SEARCH RATE LIMITING - searches are unlimited for good user experience

/**
 * Middleware to apply rate limiting based on endpoint type
 * Only limits: authorized writes and excessive login attempts
 */
export const smartRateLimit = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path;
  const method = req.method;

  // NO LIMITS for admin operations - admins can do anything
  if (path.includes('/admin/')) {
    return next();
  }

  // NO LIMITS for read operations (GET, HEAD) - users can browse freely
  if (method === 'GET' || method === 'HEAD') {
    return next();
  }

  // NO LIMITS for search operations - searches are unlimited
  if (path.includes('/search') || req.query.search) {
    return next();
  }

  // Apply authentication rate limiting for login/register attempts
  if (path.includes('/auth/login') || path.includes('/auth/register')) {
    return authRateLimit(req, res, next);
  }

  // Apply upload rate limiting for file uploads
  if (path.includes('/upload') || req.files) {
    return uploadRateLimit(req, res, next);
  }

  // Apply authorized write rate limiting for authenticated users
  if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') {
    return authorizedWriteLimit(req, res, next);
  }

  // Allow everything else
  next();
};

/**
 * Rate limiting for specific controllers
 */
export const createControllerRateLimit = (options: {
  windowMs?: number;
  max?: number;
  message?: string;
  skipReads?: boolean;
}) => {
  const {
    windowMs = 15 * 60 * 1000,
    max = 50,
    message = 'Too many requests',
    skipReads = true
  } = options;

  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      return skipReads && (req.method === 'GET' || req.method === 'HEAD');
    },
    keyGenerator: (req) => {
      const user = (req as any).user;
      if (user?.id) {
        return `controller:user:${user.id}`;
      }
      return `controller:ip:${getIPKey(req)}`;
    }
  });
};
