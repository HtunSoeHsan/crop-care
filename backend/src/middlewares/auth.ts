import { Request, Response, NextFunction } from 'express';
import { UserRole, IUser } from '../models/User';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  // TODO: Implement real admin check
  const user = req.user as IUser | undefined;
  if (user && user.role === UserRole.ADMIN) {
    return next();
  }
  return res.status(403).json({ error: 'Admin access required' });
}
