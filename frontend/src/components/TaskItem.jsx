function TaskItem({ task, onToggle, onDelete }) {
  return (
    <article className="task-item card">
      <label className="task-checkbox">
        <input
          type="checkbox"
          checked={Boolean(task.completed)}
          onChange={() => onToggle(task)}
          aria-label={`Mark ${task.title} as complete`}
        />
        <span className={task.completed ? 'task-complete' : ''}>{task.title}</span>
      </label>
      <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </article>
  );
}

export default TaskItem;
