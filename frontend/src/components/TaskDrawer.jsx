
import React, { useEffect, useState, useRef } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

function TaskDrawer({ task, onClose, onUpdate }) {
    const { addToast } = useToast();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [sendingComment, setSendingComment] = useState(false);
    const drawerRef = useRef(null);

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
        if (task) {
            fetchComments();
        }
    }, [task]);

    const fetchComments = async () => {
        setLoadingComments(true);
        try {
            const res = await api.get(`/tasks/${task.id}/comments`);
            setComments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleSendComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSendingComment(true);
        try {
            const res = await api.post(`/tasks/${task.id}/comments`, { content: newComment });
            setComments(prev => [...prev, res.data]);
            setNewComment('');
        } catch (err) {
            addToast('Failed to post comment', 'error');
        } finally {
            setSendingComment(false);
        }
    };

    if (!task) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '500px',
            backgroundColor: 'white',
            boxShadow: '-4px 0 16px rgba(0,0,0,0.1)',
            zIndex: 100,
            transform: task ? 'translateX(0)' : 'translateX(100%)', // This logic is handled by parent mounting usually, but for animation...
            transition: 'transform 0.3s ease-in-out',
            display: 'flex',
            flexDirection: 'column'
        }} ref={drawerRef}>

            {/* Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {task.project_id ? `Project #${task.project_id}` : 'Task Details'}
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--slate-900)', lineHeight: '1.3' }}>
                        {task.title}
                    </h2>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
            </div>

            {/* Body: Scrollable */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

                {/* Properties */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div>
                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Status</label>
                        <div style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', background: task.status === 'completed' ? 'var(--semantic-success-light)' : 'var(--slate-100)', color: task.status === 'completed' ? 'var(--semantic-success)' : 'var(--slate-600)', fontSize: '13px', fontWeight: '500', textTransform: 'capitalize' }}>
                            {task.status}
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Priority</label>
                        <div style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', background: 'var(--slate-100)', color: 'var(--slate-700)', fontSize: '13px', fontWeight: '500', textTransform: 'capitalize' }}>
                            {task.priority}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '32px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--slate-800)', display: 'block', marginBottom: '8px' }}>Description</label>
                    <div style={{ fontSize: '14px', color: 'var(--slate-600)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {task.description || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No description provided.</span>}
                    </div>
                </div>

                {/* Activity / Comments */}
                <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--slate-800)', display: 'block', marginBottom: '16px' }}>Activity & Comments</label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {loadingComments ? (
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading comments...</div>
                        ) : comments.length === 0 ? (
                            <div style={{ padding: '16px', backgroundColor: 'var(--slate-50)', borderRadius: '8px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                                No comments yet. Start the discussion.
                            </div>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', flexShrink: 0 }}>
                                        {comment.user_name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--slate-900)' }}>
                                            {comment.user_name} <span style={{ fontWeight: '400', color: 'var(--text-muted)', marginLeft: '6px' }}>{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div style={{ fontSize: '14px', color: 'var(--slate-700)', marginTop: '2px', lineHeight: '1.5' }}>
                                            {comment.content}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Footer: Input */}
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
    );
}

export default TaskDrawer;
