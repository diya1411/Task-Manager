import { Request, Response, NextFunction } from 'express';

export const validateTaskInput = (req: Request, res: Response, next: NextFunction) => {
  const { title, description } = req.body;
  
  if (!title || title.trim() === '') {
    return res.status(400).json({ message: 'Title is required' });
  }
  
  if (title.length > 100) {
    return res.status(400).json({ message: 'Title must be less than 100 characters' });
  }
  
  if (description && description.length > 500) {
    return res.status(400).json({ message: 'Description must be less than 500 characters' });
  }
  
  next();
};

export const validateTaskStatusUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;
  
  if (!status || !['pending', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value. Status must be either "pending" or "completed"' });
  }
  
  next();
};
