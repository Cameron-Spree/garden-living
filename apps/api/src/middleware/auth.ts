import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../services/authService.js';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing bearer token' });
    return;
  }

  const token = authHeader.slice('Bearer '.length);
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}
