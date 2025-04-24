# 🚀 Fullstack Developer Intern Assignment: Task Management System

Welcome to your Fullstack Developer Internship Assignment! This repository is a **starter template** for building a **Task Management System**. Your focus should be primarily on the **backend**, but a minimal frontend is also required to demonstrate your implementation.

---

## 📌 Assignment Overview

As a Fullstack Intern (Backend-focused), your task is to develop a **Task Management System** that allows users to manage tasks via a RESTful API and receive real-time updates via WebSockets. You'll use MongoDB for data persistence and Docker for containerization.

---

## 🎯 Objectives

You are expected to:

- [x] Develop a RESTful API for CRUD operations on tasks
- [x] Enable real-time task updates via WebSocket
- [x] Persist tasks using MongoDB with Mongoose
- [x] Containerize the backend and frontend using Docker and Docker Compose
- [x] Create a simple frontend to interact with the API and WebSocket
- [x] Write modular, clean TypeScript code
- [x] Provide clear documentation and setup instructions

---

## 🛠️ Technologies to Use

**Backend:**

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- WebSocket (`ws` library)
- `uuid`, `dotenv`

**Frontend:**

- HTML, Vanilla JavaScript, CSS

**Containerization:**

- Docker
- Docker Compose

---

## 📁 Project Structure

```
task-management-system/
├── backend/
│ ├── src/
│ │ ├── controllers/ # Route controllers
│ │ ├── models/ # MongoDB models
│ │ ├── routes/ # API routes
│ │ ├── sockets/ # WebSocket handlers
│ │ ├── utils/ # Utility functions
│ │ ├── app.ts # Express application
│ │ └── server.ts # HTTP/WebSocket server
│ ├── .env.example # Environment variables template
│ ├── Dockerfile # Backend container config
│ └── package.json
├── frontend/
│ ├── public/ # Static assets
│ ├── src/ # Frontend source code
│ ├── Dockerfile # Frontend container config
│ └── package.json
├── docker-compose.yml # Multi-container setup
└── README.md # Project documentation
```

---

## 🔧 Functional Requirements

### 📡 REST API Endpoints

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| POST   | `/api/tasks`     | Create a new task  |
| GET    | `/api/tasks`     | Get all tasks      |
| GET    | `/api/tasks/:id` | Get a task by ID   |
| PATCH  | `/api/tasks/:id` | Update task status |
| DELETE | `/api/tasks/:id` | Delete a task      |

### ⚡ WebSocket Events

| Event          | Description            | Payload             |
| -------------- | ---------------------- | ------------------- |
| `task_created` | When a task is created | New task object     |
| `task_updated` | When a task is updated | Updated task object |
| `task_deleted` | When a task is deleted | `{ id: string }`    |

### 🧾 MongoDB Schema

Each task includes:

- `id` (string, UUID)
- `title` (string)
- `description` (string)
- `status` ("pending" | "completed")
- `createdAt` (Date)

---

## 🖥️ Frontend Requirements

The frontend implementation:

- [x] Displays all tasks
- [x] Creates a new task via form
- [x] Toggles task status (pending/completed)
- [x] Deletes a task
- [x] Reflects real-time changes using WebSockets

---

## 🧪 Additional Features

- [x] Task filtering (by status)
- [x] API documentation with Swagger UI
- [x] Comprehensive test coverage
- [x] Docker containerization

---

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v16 or higher)
- Docker & Docker Compose
- npm or yarn

### ⚙️ Detailed Setup Instructions

#### Running with Docker (Recommended)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/roguedevs-hq/fullstack-be-intern-your_name.git
   cd fullstack-be-intern-your_name
   ```

2. **Set up environment variables:**
   Create a `.env` file in the `backend/` directory:

   ```
   MONGO_URI=mongodb://mongo:27017/taskdb
   PORT=5000
   ```

3. **Build and run the containers:**

   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000/api/tasks](http://localhost:5000/api/tasks)
   - API Documentation: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

#### Running Locally (Development)

1. **Backend setup:**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend setup:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **MongoDB setup:**
   Ensure MongoDB is running locally or set `MONGO_URI` to your MongoDB instance.

### 🧪 Running Tests

```bash
cd backend
npm test
```

For test coverage:

```bash
cd backend
npm test -- --coverage
```

---

## 📚 API Documentation

The API documentation is available at `/api-docs` endpoint when the server is running.

### API Endpoints Details:

#### `POST /api/tasks`

- Creates a new task
- Request body: `{ title: string, description?: string }`
- Response: The created task object with 201 status code

#### `GET /api/tasks`

- Returns all tasks
- Query parameters: `status` (optional) - Filter by task status ('pending' or 'completed')
- Response: Array of task objects

#### `GET /api/tasks/:id`

- Returns a single task by ID
- Response: Task object or 404 if not found

#### `PATCH /api/tasks/:id`

- Updates a task's status
- Request body: `{ status: 'pending' | 'completed' }`
- Response: Updated task object or 404 if not found

#### `DELETE /api/tasks/:id`

- Deletes a task
- Response: Success message with deleted task ID or 404 if not found

### WebSocket Events

Connect to WebSocket at `ws://localhost:5000` to receive real-time updates:

- `task_created`: Emitted when a new task is created
- `task_updated`: Emitted when a task is updated
- `task_deleted`: Emitted when a task is deleted

---

## ✨ Implementation Details

### Backend Architecture

- **Express.js**: Handles HTTP requests and routing
- **MongoDB/Mongoose**: Data persistence
- **WebSockets**: Real-time updates
- **TypeScript**: Type safety and better developer experience
- **Swagger UI**: API documentation

### Frontend Features

- Simple, responsive design
- Real-time updates via WebSocket
- Task filtering by status
- Form validation

---

## 🏁 Good Luck!

We look forward to seeing your implementation!
