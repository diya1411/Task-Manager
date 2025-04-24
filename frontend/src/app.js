// API URL configuration
const API_URL = 'http://localhost:5000/api/tasks';
const WS_URL = 'ws://localhost:5000';

// DOM elements
const taskForm = document.getElementById('task-form');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const tasksContainer = document.getElementById('tasks-container');
const filterAll = document.getElementById('filter-all');
const filterPending = document.getElementById('filter-pending');
const filterCompleted = document.getElementById('filter-completed');

// WebSocket connection
let socket;
setupWebSocket();

// Current filter
let currentFilter = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  fetchTasks();
  setupEventListeners();
});

function setupWebSocket() {
  socket = new WebSocket(WS_URL);
  
  socket.onopen = () => {
    console.log('WebSocket connection established');
  };
  
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    
    switch(message.event) {
      case 'task_created':
        if (shouldDisplayTask(message.data)) {
          addTaskToDOM(message.data);
        }
        break;
      case 'task_updated':
        updateTaskInDOM(message.data);
        break;
      case 'task_deleted':
        removeTaskFromDOM(message.data.id);
        break;
      default:
        console.log('Unknown event:', message.event);
    }
  };
  
  socket.onclose = () => {
    console.log('WebSocket connection closed. Reconnecting...');
    setTimeout(setupWebSocket, 3000);
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

function setupEventListeners() {
  // Form submission
  taskForm.addEventListener('submit', handleTaskFormSubmit);
  
  // Filter buttons
  filterAll.addEventListener('click', () => setFilter('all'));
  filterPending.addEventListener('click', () => setFilter('pending'));
  filterCompleted.addEventListener('click', () => setFilter('completed'));
}

async function fetchTasks() {
  try {
    const url = currentFilter === 'all' ? API_URL : `${API_URL}?status=${currentFilter}`;
    const response = await fetch(url);
    const tasks = await response.json();
    
    displayTasks(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

function displayTasks(tasks) {
  tasksContainer.innerHTML = '';
  
  if (tasks.length === 0) {
    tasksContainer.innerHTML = '<p>No tasks found.</p>';
    return;
  }
  
  tasks.forEach(task => {
    addTaskToDOM(task);
  });
}

function addTaskToDOM(task) {
  const taskElement = createTaskElement(task);
  tasksContainer.prepend(taskElement);
}

function updateTaskInDOM(task) {
  const existingTask = document.getElementById(`task-${task.id}`);
  
  if (existingTask) {
    if (shouldDisplayTask(task)) {
      const updatedTaskElement = createTaskElement(task);
      existingTask.replaceWith(updatedTaskElement);
    } else {
      existingTask.remove();
    }
  } else if (shouldDisplayTask(task)) {
    addTaskToDOM(task);
  }
}

function removeTaskFromDOM(taskId) {
  const taskElement = document.getElementById(`task-${taskId}`);
  if (taskElement) {
    taskElement.remove();
  }
}

function createTaskElement(task) {
  const taskElement = document.createElement('div');
  taskElement.className = `task-item ${task.status}`;
  taskElement.id = `task-${task.id}`;
  
  const createdAt = new Date(task.createdAt).toLocaleString();
  
  taskElement.innerHTML = `
    <div class="task-header">
      <div class="task-title">${task.title}</div>
      <div class="task-actions">
        ${task.status === 'pending' ? 
          `<button class="complete-btn" data-id="${task.id}">Complete</button>` : ''}
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      </div>
    </div>
    <div class="task-description">${task.description || 'No description provided.'}</div>
    <div class="task-metadata">
      <span>Created: ${createdAt}</span>
      <span>Status: ${task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
    </div>
  `;
  
  // Add event listeners to action buttons
  const completeBtn = taskElement.querySelector('.complete-btn');
  if (completeBtn) {
    completeBtn.addEventListener('click', () => completeTask(task.id));
  }
  
  const deleteBtn = taskElement.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => deleteTask(task.id));
  
  return taskElement;
}

async function handleTaskFormSubmit(event) {
  event.preventDefault();
  
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  
  if (!title) {
    alert('Title is required!');
    return;
  }
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create task');
    }
    
    // Reset form
    taskForm.reset();
    
    // Note: We don't need to add the task to DOM here
    // as it will come through the WebSocket
  } catch (error) {
    console.error('Error creating task:', error);
    alert(error.message);
  }
}

async function completeTask(taskId) {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'completed' })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update task');
    }
    
    // Note: We don't need to update the task in DOM here
    // as it will come through the WebSocket
  } catch (error) {
    console.error('Error updating task:', error);
    alert(error.message);
  }
}

async function deleteTask(taskId) {
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete task');
    }
    
    // Note: We don't need to remove the task from DOM here
    // as it will come through the WebSocket
  } catch (error) {
    console.error('Error deleting task:', error);
    alert(error.message);
  }
}

function setFilter(filter) {
  currentFilter = filter;
  
  // Update active filter button
  [filterAll, filterPending, filterCompleted].forEach(btn => {
    btn.classList.remove('active');
  });
  
  switch (filter) {
    case 'all':
      filterAll.classList.add('active');
      break;
    case 'pending':
      filterPending.classList.add('active');
      break;
    case 'completed':
      filterCompleted.classList.add('active');
      break;
  }
  
  fetchTasks();
}

function shouldDisplayTask(task) {
  return currentFilter === 'all' || task.status === currentFilter;
}
