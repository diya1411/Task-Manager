import express from 'express';
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskcontroller';
import { validateTaskInput, validateTaskStatusUpdate } from '../middleware/validation';

const router = express.Router();

// Apply validation middleware to routes
router.post('/', validateTaskInput, createTask);
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.patch('/:id', validateTaskStatusUpdate, updateTask);
router.delete('/:id', deleteTask);

export default router;
