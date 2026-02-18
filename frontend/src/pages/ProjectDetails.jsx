
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import TaskDrawer from '../components/TaskDrawer';
import TaskItem from '../components/TaskItem';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

function ProjectDetails() {
  const { id } = useParams();
  const { addToast } = useToast();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Derive the selected task from the latest tasks state to ensure freshness
  const selectedTask = useMemo(() =>
    tasks.find(t => t.id === selectedTaskId),
    [tasks, selectedTaskId]
  );

  // ... (Use same useEffects)

  // ...

  // In render:
  // onClick={(t) => setSelectedTaskId(t.id)}

  // In TaskDrawer:
  // task={selectedTask}
  // onClose={() => setSelectedTaskId(null)}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, tRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/tasks/${id}`)
        ]);
        setProject(pRes.data);
        setTasks(Array.isArray(tRes.data) ? tRes.data : tRes.data.items || []);
      } catch (err) {
        addToast('Failed to load project details.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, addToast]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setCreateLoading(true);
    try {
      const res = await api.post('/tasks', {
        title: taskTitle,
        project_id: Number(id),
        priority: taskPriority,
        status: 'pending'
      });
      setTasks(prev => [res.data, ...prev]);
      setTaskTitle('');
      setIsAddingTask(false);
      addToast('Task added.', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to add task', 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleToggleTask = useCallback(async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    try {
      await api.put(`/tasks/${task.id}`, { status: newStatus });
    } catch (err) {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
      addToast('Failed to update task status', 'error');
    }
  }, [addToast]);

  const handleDeleteTask = useCallback(async (taskId) => {
    if (!window.confirm('Delete this task?')) return; // Note: In a real app, use a custom modal
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      addToast('Task deleted.', 'success');
    } catch (err) {
      addToast('Failed to delete task', 'error');
    }
  }, [addToast]);

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  if (loading) return (
    <Layout>
      <div className="flex-center" style={{ padding: '60px', flexDirection: 'column', color: 'var(--text-muted)' }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: '2px solid var(--slate-300)',
          borderTopColor: 'var(--primary-600)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 12px'
        }} />
        Loading...
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Layout>
  );

  if (!project) return <Layout><div style={{ padding: '40px' }}>Project not found</div></Layout>;

  return (
    <Layout>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/dashboard" style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px', fontWeight: '500' }}>
          ← Back to Dashboard
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--slate-900)' }}>{project.name}</h1>
            <p style={{ color: 'var(--slate-500)', marginTop: '4px', lineHeight: '1.6' }}>
              {project.description || 'No description provided.'}
            </p>
          </div>
          <Button onClick={() => setIsAddingTask(!isAddingTask)} variant="primary">
            {isAddingTask ? 'Cancel' : '+ Add Task'}
          </Button>
        </div>
      </div>

      {isAddingTask && (
        <div className="animate-fade-in" style={{ marginBottom: '24px' }}>
          <Card>
            <Card.Content>
              <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <Input
                    label="Task Title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    autoFocus
                    required
                    style={{ marginBottom: 0 }}
                    placeholder="What needs to be done?"
                  />
                </div>
                <div style={{ flex: '0 0 160px' }}>
                  <Select
                    label="Priority"
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    options={priorityOptions}
                    style={{ marginBottom: 0 }}
                  />
                </div>
                <Button type="submit" loading={createLoading} style={{ marginBottom: '1px' }}>
                  Add Task
                </Button>
              </form>
            </Card.Content>
          </Card>
        </div>
      )}

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {tasks.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No tasks found. Add one to get started.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onClick={setSelectedTask}
              />
            ))}
          </div>
        )}
      </Card>

      <TaskDrawer
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={(updatedTask) => {
          setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        }}
      />
    </Layout>
  );
}

export default ProjectDetails;
