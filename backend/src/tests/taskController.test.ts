import { Request, Response } from 'express';
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController';
import { broadcastEvent } from '../sockets/socket';

// Mock dependencies
jest.mock('../models/Task', () => ({
  Task: {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn()
  }
}));
jest.mock('../sockets/socket');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid')
}));

// Import the Task model after mocking
import { Task } from '../models/Task';

describe('Task Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    jest.clearAllMocks();
  });
  
  describe('createTask', () => {
    it('should create a new task and return 201 status', async () => {
      // Arrange
      const mockTask = {
        id: 'mock-uuid',
        title: 'Test Task',
        description: 'Test Description',
        save: jest.fn().mockResolvedValue(true)
      };
      
      // Mock Task constructor
      jest.spyOn(global, 'Object').mockImplementationOnce(() => mockTask);
      
      mockRequest.body = {
        title: 'Test Task',
        description: 'Test Description'
      };
      
      // Act
      await createTask(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockTask.save).toHaveBeenCalled();
      expect(broadcastEvent).toHaveBeenCalledWith('task_created', mockTask);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });
    
    it('should return 400 status if title is missing', async () => {
      // Arrange
      mockRequest.body = {
        description: 'Test Description'
      };
      
      // Act
      await createTask(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Title is required' });
    });
    
    it('should return 400 status if title is too long', async () => {
      // Arrange
      mockRequest.body = {
        title: 'a'.repeat(101),
        description: 'Test Description'
      };
      
      // Act
      await createTask(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Title must be less than 100 characters' });
    });
    
    it('should return 400 status if description is too long', async () => {
      // Arrange
      mockRequest.body = {
        title: 'Test Task',
        description: 'a'.repeat(501)
      };
      
      // Act
      await createTask(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Description must be less than 500 characters' });
    });
  });
  
  describe('getAllTasks', () => {
    it('should return all tasks when no status filter is provided', async () => {
      // Arrange
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'pending' },
        { id: '2', title: 'Task 2', status: 'completed' }
      ];
      
      (Task.find as jest.Mock).mockResolvedValue(mockTasks);
      
      mockRequest.query = {};
      
      // Act
      await getAllTasks(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(Task.find).toHaveBeenCalledWith({});
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTasks);
    });
    
    it('should filter tasks by status when status query param is provided', async () => {
      // Arrange
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'pending' }
      ];
      
      (Task.find as jest.Mock).mockResolvedValue(mockTasks);
      
      mockRequest.query = { status: 'pending' };
      
      // Act
      await getAllTasks(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(Task.find).toHaveBeenCalledWith({ status: 'pending' });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTasks);
    });
    
    it('should handle errors and return 500 status', async () => {
      // Arrange
      const error = new Error('Database error');
      (Task.find as jest.Mock).mockRejectedValue(error);
      
      mockRequest.query = {};
      
      // Act
      await getAllTasks(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error fetching tasks', error });
    });
  });
  
  describe('getTaskById', () => {
    it('should return a task when valid ID is provided', async () => {
      // Arrange
      const mockTask = { id: 'task-123', title: 'Test Task' };
      (Task.findOne as jest.Mock).mockResolvedValue(mockTask);
      
      mockRequest.params = { id: 'task-123' };
      
      // Act
      await getTaskById(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(Task.findOne).toHaveBeenCalledWith({ id: 'task-123' });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });
    
    it('should return 404 when task is not found', async () => {
      // Arrange
      (Task.findOne as jest.Mock).mockResolvedValue(null);
      
      mockRequest.params = { id: 'non-existent-id' };
      
      // Act
      await getTaskById(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
    
    it('should handle errors and return 500 status', async () => {
      // Arrange
      const error = new Error('Database error');
      (Task.findOne as jest.Mock).mockRejectedValue(error);
      
      mockRequest.params = { id: 'task-123' };
      
      // Act
      await getTaskById(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error fetching task', error });
    });
  });
  
  describe('updateTask', () => {
    it('should update a task status and return updated task', async () => {
      // Arrange
      const mockTask = { 
        id: 'task-123', 
        title: 'Test Task', 
        status: 'completed' 
      };
      
      (Task.findOneAndUpdate as jest.Mock).mockResolvedValue(mockTask);
      
      mockRequest.params = { id: 'task-123' };
      mockRequest.body = { status: 'completed' };
      
      // Act
      await updateTask(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 'task-123' },
        { status: 'completed' },
        { new: true }
      );
      expect(broadcastEvent).toHaveBeenCalledWith('task_updated', mockTask);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });
    
    it('should return 400 if status is invalid', async () => {
      // Arrange
      mockRequest.params = { id: 'task-123' };
      mockRequest.body = { status: 'invalid-status' };
      
      // Act
      await updateTask(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid status value' });
    });
    
    it('should return 404 if task is not found', async () => {
      // Arrange
      (Task.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
      
      mockRequest.params = { id: 'non-existent-id' };
      mockRequest.body = { status: 'completed' };
      
      // Act
      await updateTask(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
    
    it('should handle errors and return 500 status', async () => {
      // Arrange
      const error = new Error('Database error');
      (Task.findOneAndUpdate as jest.Mock).mockRejectedValue(error);
      
      mockRequest.params = { id: 'task-123' };
      mockRequest.body = { status: 'completed' };
      
      // Act
      await updateTask(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error updating task', error });
    });
  });
  
  describe('deleteTask', () => {
    it('should delete a task and return success message', async () => {
      // Arrange
      const mockTask = { id: 'task-123', title: 'Test Task' };
      (Task.findOneAndDelete as jest.Mock).mockResolvedValue(mockTask);
      
      mockRequest.params = { id: 'task-123' };
      
      // Act
      await deleteTask(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(Task.findOneAndDelete).toHaveBeenCalledWith({ id: 'task-123' });
      expect(broadcastEvent).toHaveBeenCalledWith('task_deleted', { id: 'task-123' });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Task deleted successfully', 
        id: 'task-123' 
      });
    });
    
    it('should return 404 if task to delete is not found', async () => {
      // Arrange
      (Task.findOneAndDelete as jest.Mock).mockResolvedValue(null);
      
      mockRequest.params = { id: 'non-existent-id' };
      
      // Act
      await deleteTask(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
    
    it('should handle errors and return 500 status', async () => {
      // Arrange
      const error = new Error('Database error');
      (Task.findOneAndDelete as jest.Mock).mockRejectedValue(error);
      
      mockRequest.params = { id: 'task-123' };
      
      // Act
      await deleteTask(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error deleting task', error });
    });
  });
});
