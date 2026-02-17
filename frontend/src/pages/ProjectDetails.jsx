import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';
import api from '../api/axios';

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const [projectResponse, taskResponse] = await Promise.all([
          api.get('/projects'),
          api.get(`/tasks/${id}`),
        ]);

        const selectedProject = (projectResponse.data || []).find(
          (candidate) => String(candidate.id) === String(id),
        );

        setProject(selectedProject || null);
        setTasks(taskResponse.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load project details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const response = await api.post('/tasks', { title: taskTitle.trim(), project_id: Number(id) });
      setTasks((prev) => [response.data, ...prev]);
      setTaskTitle('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create task.');
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const response = await api.put(`/tasks/${task.id}`, {
        title: task.title,
        completed: !task.completed,
        project_id: task.project_id,
      });
      setTasks((prev) => prev.map((item) => (item.id === task.id ? response.data : item)));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete task.');
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="details-page">
        <Link to="/dashboard" className="link-back">
          ← Back to dashboard
        </Link>

        <section className="card">
          <h1>{project?.name || 'Project Details'}</h1>
          <p className="subtext">Track tasks and keep progress visible.</p>

          <form className="inline-form" onSubmit={handleCreateTask}>
            <input
              type="text"
              placeholder="Add a new task"
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </form>

          {error ? <p className="message message-error">{error}</p> : null}

          {loading ? (
            <p className="subtext">Loading tasks...</p>
          ) : (
            <section className="task-list">
              {tasks.length === 0 ? (
                <article className="card empty-state">
                  <p>No tasks yet. Add one to start tracking progress.</p>
                </article>
              ) : (
                tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />
                ))
              )}
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

export default ProjectDetails;
