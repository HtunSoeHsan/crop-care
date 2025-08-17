import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';
import User from '../models/User';

// Define JWT payload interface
interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const cookieToken = req.cookies?.token;
  let token: string | null = null;
  
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7); // Remove 'Bearer ' prefix
  } else if (cookieToken) {
    token = cookieToken;
  }
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Access token is required',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
    
    // Attach user to request
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        status: 'error',
        message: 'Token has expired',
      });
    }
    return res.status(403).json({
      status: 'error',
      message: 'Invalid token',
    });
  }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Authentication required' 
      });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== UserRole.ADMIN) {
      return res.status(403).json({ 
        status: 'error',
        message: 'Admin access required' 
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
};

export const requireRole = (roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({ 
          status: 'error',
          message: 'Authentication required' 
        });
      }

      const user = await User.findById(userId);
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ 
          status: 'error',
          message: 'Insufficient permissions' 
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ 
        status: 'error',
        message: 'Server error' 
      });
    }
  };
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const cookieToken = req.cookies?.token;
  let token: string | null = null;
  
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (cookieToken) {
    token = cookieToken;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
      (req as any).user = decoded;
    } catch (error) {
      // Token is invalid, but we continue without user
      (req as any).user = null;
    }
  } else {
    (req as any).user = null;
  }

  next();
};