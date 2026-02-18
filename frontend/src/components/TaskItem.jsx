
import React, { memo } from 'react';
import Badge from './ui/Badge';

const TaskItem = memo(({ task, onToggle, onDelete, onClick }) => {
  const isCompleted = task.status === 'completed';

  const priorityColor = {
    low: 'neutral',
    medium: 'warning',
    high: 'danger',
    critical: 'danger'
  }[task.priority] || 'neutral';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--slate-100)',
      transition: 'background 0.1s',
      gap: '12px',
      cursor: 'pointer'
    }} className="task-item-row" onClick={() => onClick && onClick(task)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggle(task)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Mark task "${task.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
          style={{
            flexShrink: 0,
            width: '18px',
            height: '18px',
            accentColor: 'var(--primary-600)',
            cursor: 'pointer'
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
            textDecoration: isCompleted ? 'line-through' : 'none',
            transition: 'color 0.2s',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }} title={task.title}>
            {task.title}
          </span>
          {task.description && (
            <span className="text-xs text-muted" style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>{task.description}</span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        {task.priority && (
          <div className="hidden-mobile">
            <Badge variant={priorityColor}>{task.priority}</Badge>
          </div>
        )}

        {task.due_date && (
          <span className="text-xs text-muted hidden-mobile">
            {new Date(task.due_date).toLocaleDateString()}
          </span>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--slate-400)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
            transition: 'background 0.2s, color 0.2s'
          }}
          title="Delete task"
          className="hover:bg-slate-100 hover:text-red-600"
          aria-label={`Delete task ${task.title}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
      <style>{`
        @media (max-width: 480px) {
          .hidden-mobile { display: none; }
          .task-item-row { padding: 10px 12px; }
        }
        button:hover { background-color: var(--slate-100); color: var(--danger-text) !important; }
      `}</style>
    </div>
  );
}, (prev, next) => {
  return prev.task.id === next.task.id &&
    prev.task.status === next.task.status &&
    prev.task.title === next.task.title &&
    prev.task.priority === next.task.priority;
});

export default TaskItem;
