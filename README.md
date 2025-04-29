# 🚀 Task Management System

A full-stack task management application featuring a RESTful API with real-time updates via WebSockets. This project demonstrates my backend development skills with a complementary frontend interface.

---

## 📌 Project Overview

This **Task Management System** allows users to manage tasks via a RESTful API and receive real-time updates via WebSockets. It uses MongoDB for data persistence and Docker for containerization, focusing on modern backend development with a clean, minimal frontend.

---

## 🎯 Features

- [x] RESTful API for CRUD operations on tasks
- [x] Real-time task updates via WebSocket
- [x] MongoDB with Mongoose for data persistence
- [x] Docker and Docker Compose containerization
- [x] Simple frontend to interact with the API and WebSocket
- [x] Modular, clean TypeScript code

---

## 🛠️ Technologies Used

**Backend:**
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- WebSocket (`ws` library)
- `uuid`, `dotenv`

**Frontend:**
- HTML, JavaScript, CSS

**Containerization:**
- Docker
- Docker Compose

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

## 🖥️ Frontend Features

The frontend implementation:

- [x] Displays all tasks
- [x] Creates a new task via form
- [x] Toggles task status (pending/completed)
- [x] Deletes a task
- [x] Reflects real-time changes using WebSockets

---

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v16 or higher)
- Docker & Docker Compose
- npm or yarn

### ⚙️ Setup Instructions

#### Running with Docker (Recommended)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/task-manager.git
   cd task-manager
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

---

## ✨ Implementation Details

### Backend Architecture

- **Express.js**: Handles HTTP requests and routing
- **MongoDB/Mongoose**: Data persistence
- **WebSockets**: Real-time updates
- **TypeScript**: Type safety and better developer experience

### Frontend Features

- Simple, responsive design
- Real-time updates via WebSocket
- Task filtering by status
- Form validation

---

## 📝 License

MIT

---

