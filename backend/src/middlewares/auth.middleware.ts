import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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