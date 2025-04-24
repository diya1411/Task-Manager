import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/tasks', taskRoutes);

export default app;
