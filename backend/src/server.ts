import http from 'http';
import { WebSocketServer } from 'ws';
import app from './app';
import { socketHandler } from './sockets/socket';
import mongoose from 'mongoose';

const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });
socketHandler(wss);

const PORT = process.env.PORT || 5000;

// Use appropriate MongoDB connection string based on environment
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/taskdb';

mongoose.connect(mongoUri).then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`MongoDB connected to: ${mongoUri}`);
  });
});
