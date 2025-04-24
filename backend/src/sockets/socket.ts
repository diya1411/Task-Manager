import WebSocket from 'ws';

let clients: WebSocket[] = [];

export const socketHandler = (wss: WebSocket.Server) => {
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');
    clients.push(ws);
    
    ws.on('close', () => {
      clients = clients.filter(client => client !== ws);
      console.log('Client disconnected');
    });
  });
};

export const broadcastEvent = (event: string, data: any) => {
  const message = JSON.stringify({ event, data });
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};