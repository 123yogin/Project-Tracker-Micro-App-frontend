import React from 'react';

function TaskItem({ task, onToggle, onDelete }) {
  const isCompleted = task.status === 'completed';

  return (
    <article className="task-item card">
      <label className="task-checkbox">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggle(task)}
          aria-label={`Mark ${task.title} as ${isCompleted ? 'pending' : 'complete'}`}
        />
        <span className={isCompleted ? 'task-complete' : ''}>{task.title}</span>
      </label>
      {task.priority && (
        <span className={`priority-badge priority-${task.priority}`}>
          {task.priority}
        </span>
      )}
      <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </article>
  );
}

export default TaskItem;
