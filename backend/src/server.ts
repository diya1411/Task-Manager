import http from 'http';
import { Server as WebSocketServer } from 'ws';
import app from './app';
import { socketHandler } from './sockets/socket';
import mongoose from 'mongoose';

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

socketHandler(wss);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI!).then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
