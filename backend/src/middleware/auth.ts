import { Response } from 'express';

const isAuthenticated = (req: any, res: Response, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

export { isAuthenticated };