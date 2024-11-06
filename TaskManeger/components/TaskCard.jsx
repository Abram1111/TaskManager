"use client";

import React from 'react';
import './TaskCard.css'; // Importing the CSS file

function TaskCard({ task, onComplete, onEdit, onDelete }) {
  const { id, title, description, isCompleted } = task;

  return (
    <div className={`task-card ${isCompleted ? 'completed' : ''}`}>
      <div className="task-details">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="task-buttons">
        <button
          onClick={() => onComplete(id)}
          className={`complete-button ${isCompleted ? 'completed' : ''}`}
        >
          <i className={`fas ${isCompleted ? 'fa-check-circle' : 'fa-check-circle'}`}></i>
        </button>
        <button
          onClick={() => onEdit(id)}
          className={`edit-button ${isCompleted ? 'completed' : ''}`}
        >
          <i className="fas fa-pencil-alt"></i>
        </button>
        <button
          onClick={() => onDelete(id)}
          className={`delete-button ${isCompleted ? 'completed' : ''}`}
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
