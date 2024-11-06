"use client";
import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import './TaskList.css';
import 'font-awesome/css/font-awesome.min.css';

export default function Tasklist() {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [errors, setErrors] = useState({ title: '', description: '' });

  // Fetch tasks from API on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/tasks');
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/tasks/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedTasks = tasks.filter(task => task.id !== id);
          setTasks(updatedTasks);
        } else {
          console.error('Failed to delete task');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const complete = async (id) => {
    const confirmStatus = window.confirm("Are you sure you want to change status?");
    if (confirmStatus) {
      try {
        const response = await fetch(`http://localhost:5000/tasks/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ isCompleted: true }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const updatedTask = await response.json();
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task.id === id ? { ...task, isCompleted: updatedTask.isCompleted } : task
            )
          );
        } else {
          console.error('Failed to update task status');
        }
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
  };

  const startEditing = (id, title, description) => {
    const task = tasks.find(task => task.id === id);
    if (!task.isCompleted) {
      setEditingTaskId(id);
      setNewTaskTitle(title);
      setNewTaskDescription(description);
    }
  };

  // Validation check for empty fields
  const validateFields = () => {
    let valid = true;
    const newErrors = { title: '', description: '' };

    if (newTaskTitle.trim() === '') {
      newErrors.title = 'Title is required';
      valid = false;
    }

    if (newTaskDescription.trim() === '') {
      newErrors.description = 'Description is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const saveEdit = async () => {
    if (!validateFields()) return;

    try {
      const response = await fetch(`http://localhost:5000/tasks/${editingTaskId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === editingTaskId
              ? updatedTask
              : task
          )
        );
        setEditingTaskId(null);
        setNewTaskTitle('');
        setNewTaskDescription('');
      } else {
        console.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  // Function to save a new task
  const saveNewTask = async () => {
    if (!validateFields()) return;

    const newTask = { title: newTaskTitle, description: newTaskDescription, isCompleted: false };
    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        body: JSON.stringify(newTask),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const addedTask = await response.json();
        setTasks(prevTasks => [...prevTasks, addedTask]);
        setShowAddModal(false);
        setNewTaskTitle('');
        setNewTaskDescription('');
      } else {
        console.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div>
      <div className="task-list">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={complete}
            onEdit={() => startEditing(task.id, task.title, task.description)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {editingTaskId && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Task</h2>
            <label htmlFor="taskTitle">Title</label>
            <input
              id="taskTitle"
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Edit Title"
            />
            {errors.title && <small className="error">{errors.title}</small>}
            <label htmlFor="taskDescription">Description</label>
            <input
              id="taskDescription"
              type="text"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Edit Description"
            />
            {errors.description && <small className="error">{errors.description}</small>}
            <div className="button-container">
              <button onClick={saveEdit}>
                Save
              </button>
              <button onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Task</h2>
            <label htmlFor="newTaskTitle">Title</label>
            <input
              id="newTaskTitle"
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task Title"
            />
            {errors.title && <small className="error">{errors.title}</small>}
            <label htmlFor="newTaskDescription">Description</label>
            <input
              id="newTaskDescription"
              type="text"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Task Description"
            />
            {errors.description && <small className="error">{errors.description}</small>}
            <div className="button-container">
              <button onClick={saveNewTask}>
                Save
              </button>
              <button onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <button className="add-task-btn" onClick={() => setShowAddModal(true)}>
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
}
