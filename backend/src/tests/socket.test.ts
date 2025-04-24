import { Server } from 'http';
import { WebSocketServer } from 'ws';
import { socketHandler, broadcastEvent, clients } from '../sockets/socket';

// Create a type with the subset of WebSocket properties we need
type PartialWebSocket = {
  on?: jest.Mock;
  readyState: number;
  send: jest.Mock;
  // Add any other properties your code uses
};

// Mock the WebSocketServer
jest.mock('ws', () => {
  const mockOn = jest.fn();
  
  return {
    WebSocketServer: jest.fn().mockImplementation(() => ({
      on: mockOn
    })),
    WebSocket: {
      OPEN: 1,
      CLOSING: 2
    }
  };
});

describe('WebSocket Handler', () => {
  let mockServer: Partial<Server>;
  let mockWSServer: any;
  let connectionCallback: Function;
  
  beforeEach(() => {
    // Clear the clients array before each test
    while (clients.length > 0) {
      clients.pop();
    }
    
    mockServer = {};
    mockWSServer = new WebSocketServer({});
    
    // Reset all mocks and capture the connection callback
    jest.clearAllMocks();
    mockWSServer.on.mockImplementation((event: string, callback: Function) => {
      if (event === 'connection') {
        connectionCallback = callback;
      }
    });
  });
  
  describe('socketHandler', () => {
    it('should add client to clients array on connection', () => {
      // Arrange
      const mockClient = {
        on: jest.fn(),
        readyState: 1, // WebSocket.OPEN
        send: jest.fn()
      } as PartialWebSocket;
      
      // Act
      socketHandler(mockServer as Server);
      
      // Manually invoke the connection callback with our mock client
      expect(mockWSServer.on).toHaveBeenCalledWith('connection', expect.any(Function));
      
      // Make sure connectionCallback is defined before using it
      expect(connectionCallback).toBeDefined();
      connectionCallback(mockClient);
      
      // Assert
      expect(clients.length).toBe(1);
      expect(clients[0]).toBe(mockClient);
      expect(mockClient.on).toHaveBeenCalledWith('close', expect.any(Function));
    });
    
    it('should remove client from clients array on close', () => {
      // Arrange
      let closeCallback: Function | undefined;
      
      const mockClient = {
        on: jest.fn().mockImplementation((event: string, callback: Function) => {
          if (event === 'close') {
            closeCallback = callback;
          }
        }),
        readyState: 1, // WebSocket.OPEN
        send: jest.fn()
      } as PartialWebSocket;
      
      // Act - set up the connection
      socketHandler(mockServer as Server);
      
      // Make sure connectionCallback is defined before using it
      expect(connectionCallback).toBeDefined();
      connectionCallback(mockClient);
      
      // Verify client was added
      expect(clients.length).toBe(1);
      expect(clients[0]).toBe(mockClient);
      
      // Make sure closeCallback was assigned
      expect(closeCallback).toBeDefined();
      
      // Simulate close event
      if (closeCallback) {
        closeCallback();
      }
      
      // Assert
      expect(clients.length).toBe(0);
      expect(clients).not.toContain(mockClient);
    });
  });
  
  describe('broadcastEvent', () => {
    it('should send message to all connected clients', () => {
      // Arrange
      const mockClient = {
        readyState: 1, // WebSocket.OPEN
        send: jest.fn()
      } as PartialWebSocket;
      
      // Add the mock client to the clients array
      clients.push(mockClient as any);
      
      const event = 'test_event';
      const data = { id: '123', name: 'Test' };
      
      // Act
      broadcastEvent(event, data);
      
      // Assert
      expect(mockClient.send).toHaveBeenCalledWith(JSON.stringify({ event, data }));
    });
    
    it('should not send message to clients not in OPEN state', () => {
      // Arrange
      const mockClient = {
        readyState: 2, // WebSocket.CLOSING
        send: jest.fn()
      } as PartialWebSocket;
      
      // Add the mock client to the clients array
      clients.push(mockClient as any);
      
      const event = 'test_event';
      const data = { id: '123', name: 'Test' };
      
      // Act
      broadcastEvent(event, data);
      
      // Assert
      expect(mockClient.send).not.toHaveBeenCalled();
    });
  });
});
