import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
  id: { type: String, required: true },
  title: String,
  description: String,
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export const Task = model('Task', taskSchema); 
