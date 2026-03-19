import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import TaskDrawer from '../components/TaskDrawer';
import TaskItem from '../components/TaskItem';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const BOARD_STATUSES = [
  { key: 'pending', label: 'Backlog', tone: 'neutral' },
  { key: 'in_progress', label: 'In Progress', tone: 'warning' },
  { key: 'completed', label: 'Done', tone: 'success' },
];

function ProjectDetails() {
  const { id } = useParams();
  const { addToast } = useToast();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('board');
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) || null,
    [tasks, selectedTaskId],
  );

  const isOwner = project && user && project.user_id === user.id;

  const assigneeOptions = useMemo(
    () => [
      { value: '', label: 'Unassigned' },
      ...members.map((member) => ({
        value: String(member.user_id),
        label: member.full_name || member.email,
      })),
    ],
    [members],
  );

  const filteredTasks = useMemo(() => {
    if (statusFilter === 'all') {
      return tasks;
    }
    return tasks.filter((task) => task.status === statusFilter);
  }, [tasks, statusFilter]);

  const groupedTasks = useMemo(() => {
    const groups = { pending: [], in_progress: [], completed: [] };
    filteredTasks.forEach((task) => {
      if (groups[task.status]) {
        groups[task.status].push(task);
      } else {
        groups.pending.push(task);
      }
    });
    return groups;
  }, [filteredTasks]);

  const counts = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'completed').length;
    return {
      total: tasks.length,
      completed,
      open: tasks.length - completed,
    };
  }, [tasks]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [projectRes, taskRes, memberRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/${id}`),
        api.get(`/projects/${id}/members`),
      ]);
      setProject(projectRes.data);
      setTasks(Array.isArray(taskRes.data) ? taskRes.data : taskRes.data.items || []);
      setMembers(memberRes.data.items || []);
    } catch {
      addToast('Failed to load project details.', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetTaskForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setTaskDueDate('');
    setTaskAssigneeId('');
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    if (!taskTitle.trim()) {
      return;
    }

    setCreateLoading(true);
    try {
      const response = await api.post('/tasks', {
        title: taskTitle.trim(),
        description: taskDescription.trim() || null,
        project_id: Number(id),
        priority: taskPriority,
        status: 'pending',
        due_date: taskDueDate ? new Date(taskDueDate).toISOString() : null,
        assignee_id: taskAssigneeId ? Number(taskAssigneeId) : null,
      });
      setTasks((prev) => [response.data, ...prev]);
      resetTaskForm();
      setIsAddingTask(false);
      addToast('Task added.', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to add task', 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleInvite = async (event) => {
    event.preventDefault();
    if (!inviteEmail.trim()) {
      return;
    }

    setInviteLoading(true);
    try {
      await api.post(`/projects/${id}/invites`, { email: inviteEmail.trim() });
      setInviteEmail('');
      addToast('Invite sent.', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to send invite', 'error');
    } finally {
      setInviteLoading(false);
    }
  };

  const updateTaskStatus = useCallback(
    async (task, nextStatus) => {
      const optimistic = { ...task, status: nextStatus };
      setTasks((prev) => prev.map((item) => (item.id === task.id ? optimistic : item)));

      try {
        const response = await api.put(`/tasks/${task.id}`, { status: nextStatus });
        setTasks((prev) => prev.map((item) => (item.id === task.id ? response.data : item)));
      } catch {
        setTasks((prev) => prev.map((item) => (item.id === task.id ? task : item)));
        addToast('Failed to update task status', 'error');
      }
    },
    [addToast],
  );

  const handleToggleTask = useCallback(
    async (task) => {
      const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
      await updateTaskStatus(task, nextStatus);
    },
    [updateTaskStatus],
  );

  const handleDeleteTask = useCallback(
    async (taskId) => {
      if (!window.confirm('Delete this task?')) {
        return;
      }

      try {
        await api.delete(`/tasks/${taskId}`);
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        if (selectedTaskId === taskId) {
          setSelectedTaskId(null);
        }
        addToast('Task deleted.', 'success');
      } catch {
        addToast('Failed to delete task', 'error');
      }
    },
    [addToast, selectedTaskId],
  );

  const handleTaskUpdateFromDrawer = useCallback((updatedTask) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  }, []);

  const handleDropToStatus = async (statusKey) => {
    if (!draggingTaskId) {
      return;
    }
    const task = tasks.find((item) => item.id === draggingTaskId);
    setDraggingTaskId(null);
    if (!task || task.status === statusKey) {
      return;
    }
    await updateTaskStatus(task, statusKey);
  };

  const handleRemoveMember = async (memberUserId) => {
    if (!window.confirm('Remove this member from project?')) {
      return;
    }
    try {
      await api.delete(`/projects/${id}/members/${memberUserId}`);
      setMembers((prev) => prev.filter((member) => member.user_id !== memberUserId));
      addToast('Member removed.', 'success');
      await fetchData();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to remove member', 'error');
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  const filterOptions = [
    { value: 'all', label: `All (${counts.total})` },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: `Completed (${counts.completed})` },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex-center" style={{ padding: '60px', flexDirection: 'column', color: 'var(--text-muted)' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              border: '2px solid var(--slate-300)',
              borderTopColor: 'var(--primary-600)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 12px',
            }}
          />
          Loading...
        </div>
        <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div style={{ padding: '40px' }}>Project not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ marginBottom: '24px' }}>
        <Link
          to="/dashboard"
          style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '12px',
            fontWeight: '500',
          }}
        >
          {'<- Back to Dashboard'}
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ maxWidth: '680px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: '700', color: 'var(--slate-900)' }}>{project.name}</h1>
            <p style={{ color: 'var(--slate-500)', marginTop: '4px', lineHeight: '1.6' }}>
              {project.description || 'No description provided.'}
            </p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Badge variant="primary">{counts.total} tasks</Badge>
              <Badge variant="warning">{counts.open} open</Badge>
              <Badge variant="success">{counts.completed} complete</Badge>
              <Badge variant="neutral">{members.length} members</Badge>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <div style={{ width: '170px' }}>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={filterOptions} style={{ marginBottom: 0 }} />
            </div>
            <div style={{ display: 'inline-flex', padding: '4px', backgroundColor: 'var(--slate-100)', borderRadius: '999px' }}>
              <Button size="sm" variant={viewMode === 'board' ? 'primary' : 'ghost'} onClick={() => setViewMode('board')}>
                Board
              </Button>
              <Button size="sm" variant={viewMode === 'list' ? 'primary' : 'ghost'} onClick={() => setViewMode('list')}>
                List
              </Button>
            </div>
            <Button onClick={() => setIsAddingTask((prev) => !prev)} variant="primary">
              {isAddingTask ? 'Cancel' : '+ Add Task'}
            </Button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '16px' }} className="project-main-grid">
        <div>
          {isAddingTask && (
            <div className="animate-fade-in" style={{ marginBottom: '24px' }}>
              <Card>
                <Card.Content>
                  <form onSubmit={handleCreateTask} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
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

                    <div style={{ gridColumn: '1 / -1' }}>
                      <Input
                        label="Description"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        style={{ marginBottom: 0 }}
                        placeholder="Add context for the team"
                      />
                    </div>

                    <Select
                      label="Priority"
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value)}
                      options={priorityOptions}
                      style={{ marginBottom: 0 }}
                    />

                    <Input
                      label="Due Date"
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      style={{ marginBottom: 0 }}
                    />

                    <div style={{ gridColumn: '1 / -1' }}>
                      <Select
                        label="Assignee"
                        value={taskAssigneeId}
                        onChange={(e) => setTaskAssigneeId(e.target.value)}
                        options={assigneeOptions}
                        style={{ marginBottom: 0 }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                      <Button type="submit" loading={createLoading}>Add Task</Button>
                    </div>
                  </form>
                </Card.Content>
              </Card>
            </div>
          )}

          {viewMode === 'list' ? (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              {filteredTasks.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No tasks match this filter.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {filteredTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                      onClick={(clickedTask) => setSelectedTaskId(clickedTask.id)}
                    />
                  ))}
                </div>
              )}
            </Card>
          ) : (
            <div className="board-grid">
              {BOARD_STATUSES.map((column) => (
                <div
                  key={column.key}
                  className="board-col"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDropToStatus(column.key)}
                >
                  <div className="board-col-head">
                    <h3>{column.label}</h3>
                    <Badge variant={column.tone}>{groupedTasks[column.key].length}</Badge>
                  </div>
                  <div className="board-col-body">
                    {groupedTasks[column.key].length === 0 ? (
                      <div className="board-empty">Drop tasks here</div>
                    ) : (
                      groupedTasks[column.key].map((task) => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={() => setDraggingTaskId(task.id)}
                          className="task-board-card"
                          onClick={() => setSelectedTaskId(task.id)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--slate-900)' }}>{task.title}</div>
                              {task.description && (
                                <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginTop: '4px' }}>{task.description}</div>
                              )}
                            </div>
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteTask(task.id);
                              }}
                              className="task-delete"
                              aria-label={`Delete ${task.title}`}
                            >
                              x
                            </button>
                          </div>
                          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Badge variant={task.priority === 'critical' || task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'neutral'}>
                              {task.priority || 'none'}
                            </Badge>
                            <span style={{ fontSize: '11px', color: 'var(--slate-400)' }}>
                              {task.assignee_name || task.assignee_email || 'Unassigned'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <Card>
            <Card.Header title="Project Members" />
            <Card.Content>
              <div style={{ display: 'grid', gap: '10px' }}>
                {members.map((member) => (
                  <div key={member.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{member.full_name || member.email}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{member.role}</div>
                    </div>
                    {isOwner && member.role !== 'owner' && (
                      <Button size="sm" variant="ghost" onClick={() => handleRemoveMember(member.user_id)}>
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {isOwner && (
                <form onSubmit={handleInvite} style={{ marginTop: '16px', borderTop: '1px solid var(--slate-200)', paddingTop: '14px' }}>
                  <Input
                    label="Invite by Email"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    placeholder="teammate@company.com"
                    style={{ marginBottom: 0 }}
                  />
                  <Button type="submit" loading={inviteLoading} style={{ width: '100%', marginTop: '10px' }}>
                    Send Invite
                  </Button>
                </form>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>

      <TaskDrawer
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onUpdate={handleTaskUpdateFromDrawer}
        assigneeOptions={assigneeOptions}
      />

      <style>{`
        .board-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(220px, 1fr));
          gap: 16px;
        }
        .board-col {
          border: 1px solid var(--slate-200);
          border-radius: 12px;
          background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
          min-height: 460px;
          display: flex;
          flex-direction: column;
        }
        .board-col-head {
          padding: 12px;
          border-bottom: 1px solid var(--slate-200);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .board-col-head h3 {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .board-col-body {
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 300px;
        }
        .board-empty {
          border: 1px dashed var(--slate-300);
          border-radius: 10px;
          color: var(--slate-500);
          font-size: 12px;
          text-align: center;
          padding: 14px;
          background: var(--slate-50);
        }
        .task-board-card {
          border: 1px solid var(--slate-200);
          border-radius: 10px;
          padding: 12px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.05);
          cursor: pointer;
        }
        .task-board-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
        }
        .task-delete {
          background: transparent;
          border: none;
          color: var(--slate-400);
          cursor: pointer;
          font-weight: 700;
          padding: 0;
        }
        .task-delete:hover {
          color: var(--danger-text);
        }
        @media (max-width: 1220px) {
          .project-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 1024px) {
          .board-grid {
            grid-template-columns: 1fr;
          }
          .board-col {
            min-height: auto;
          }
        }
      `}</style>
    </Layout>
  );
}

export default ProjectDetails;
