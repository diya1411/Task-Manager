import { Request, Response } from 'express';
import { Task } from '../models/Task';
import { v4 as uuidv4 } from 'uuid';
import { broadcastEvent } from '../sockets/socket';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    
    // Input validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    if (title.length > 100) {
      return res.status(400).json({ message: 'Title must be less than 100 characters' });
    }
    
    if (description && description.length > 500) {
      return res.status(400).json({ message: 'Description must be less than 500 characters' });
    }
    
    const newTask = new Task({ id: uuidv4(), title, description });
    await newTask.save();
    broadcastEvent('task_created', newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    // Filter by status if provided
    const filter: any = {};
    if (status && ['pending', 'completed'].includes(status as string)) {
      filter.status = status;
    }
    
    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const updatedTask = await Task.findOneAndUpdate(
      { id },
      { status },
      { new: true }
    );
    
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    broadcastEvent('task_updated', updatedTask);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    broadcastEvent('task_deleted', { id });
    res.status(200).json({ message: 'Task deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};
