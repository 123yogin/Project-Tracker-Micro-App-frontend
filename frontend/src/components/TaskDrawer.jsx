import React, { useEffect, useRef, useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

function TaskDrawer({ task, onClose, onUpdate, assigneeOptions = [{ value: '', label: 'Unassigned' }] }) {
  const { addToast } = useToast();
  const drawerRef = useRef(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!task) {
      return;
    }

    setTitle(task.title || '');
    setDescription(task.description || '');
    setStatus(task.status || 'pending');
    setPriority(task.priority || 'medium');
    setDueDate(task.due_date ? task.due_date.slice(0, 10) : '');
    setAssigneeId(task.assignee_id ? String(task.assignee_id) : '');
    setEditing(false);

    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const response = await api.get(`/tasks/${task.id}/comments`);
        setComments(response.data || []);
      } catch {
        addToast('Failed to load comments', 'error');
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [task, addToast]);

  const handleSendComment = async (event) => {
    event.preventDefault();
    if (!newComment.trim()) {
      return;
    }

    setSendingComment(true);
    try {
      const response = await api.post(`/tasks/${task.id}/comments`, {
        content: newComment,
      });
      setComments((prev) => [...prev, response.data]);
      setNewComment('');
      addToast('Comment posted.', 'success');
    } catch {
      addToast('Failed to post comment', 'error');
    } finally {
      setSendingComment(false);
    }
  };

  const handleSaveTask = async () => {
    if (!title.trim()) {
      addToast('Task title is required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const response = await api.put(`/tasks/${task.id}`, {
        title: title.trim(),
        description: description.trim() || null,
        status,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        assignee_id: assigneeId ? Number(assigneeId) : null,
      });
      onUpdate(response.data);
      setEditing(false);
      addToast('Task updated.', 'success');
    } catch {
      addToast('Failed to update task', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!task) {
    return null;
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.25)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        ref={drawerRef}
        style={{
          width: '100%',
          maxWidth: '560px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '-6px 0 24px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Task #{task.id}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--slate-900)', lineHeight: '1.3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {task.title}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!editing ? (
              <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit</Button>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSaveTask} loading={saving}>Save</Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>x</Button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {editing ? (
            <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
              <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={statusOptions} />
                <Select label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)} options={priorityOptions} />
              </div>
              <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              <Select
                label="Assignee"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                options={assigneeOptions}
              />
            </div>
          ) : (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Status</div>
                  <div style={{ fontSize: '14px', color: 'var(--slate-700)', textTransform: 'capitalize' }}>{task.status?.replace('_', ' ')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Priority</div>
                  <div style={{ fontSize: '14px', color: 'var(--slate-700)', textTransform: 'capitalize' }}>{task.priority || 'None'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Due Date</div>
                  <div style={{ fontSize: '14px', color: 'var(--slate-700)' }}>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Not set'}</div>
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Assignee</div>
                <div style={{ fontSize: '14px', color: 'var(--slate-700)' }}>
                  {task.assignee_name || task.assignee_email || 'Unassigned'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Description</div>
                <div style={{ fontSize: '14px', color: 'var(--slate-700)', lineHeight: '1.6' }}>{task.description || 'No description provided.'}</div>
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--slate-800)', display: 'block', marginBottom: '12px' }}>Comments</label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {loadingComments ? (
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading comments...</div>
              ) : comments.length === 0 ? (
                <div style={{ padding: '14px', backgroundColor: 'var(--slate-50)', borderRadius: '8px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                  No comments yet.
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', flexShrink: 0 }}>
                      {comment.user_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--slate-900)' }}>
                        {comment.user_name}
                        <span style={{ fontWeight: '400', color: 'var(--text-muted)', marginLeft: '6px' }}>
                          {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--slate-700)', marginTop: '2px', lineHeight: '1.5' }}>{comment.content}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--slate-200)', backgroundColor: 'var(--slate-50)' }}>
          <form onSubmit={handleSendComment} style={{ display: 'flex', gap: '8px' }}>
            <Input
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ marginBottom: 0, backgroundColor: 'white' }}
            />
            <Button type="submit" disabled={sendingComment || !newComment.trim()} loading={sendingComment}>Send</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskDrawer;
