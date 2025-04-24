import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';

// Store connected clients
export const clients: WebSocket[] = [];

// Socket handler to initialize WebSocket server
export const socketHandler = (server: Server): void => {
  const wss = new WebSocketServer({ server });
  
  wss.on('connection', (ws: WebSocket) => {
    // Add client to clients array
    clients.push(ws);
    
    // Remove client when connection is closed
    ws.on('close', () => {
      const index = clients.indexOf(ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
    });
  });
};

// Broadcast event to all connected clients
export const broadcastEvent = (event: string, data: any): void => {
  const message = JSON.stringify({ event, data });
  
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};