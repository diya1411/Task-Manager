import { Request, Response, NextFunction } from 'express';

export const validateTaskInput = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description } = req.body;
  
  if (!title || title.trim() === '') {
    res.status(400).json({ message: 'Title is required' });
    return;
  }
  
  if (title.length > 100) {
    res.status(400).json({ message: 'Title must be less than 100 characters' });
    return;
  }
  
  if (description && description.length > 500) {
    res.status(400).json({ message: 'Description must be less than 500 characters' });
    return;
  }
  
  next();
};

export const validateTaskStatusUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { status } = req.body;
  
  if (!status || !['pending', 'completed'].includes(status)) {
    res.status(400).json({ message: 'Invalid status value. Status must be either "pending" or "completed"' });
    return;
  }
  
  next();
};
