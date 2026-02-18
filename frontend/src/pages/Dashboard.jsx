
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

function Dashboard() {
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Memoize fetchProjects to avoid dependency issues or unnecessary recreations
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [projRes, actRes] = await Promise.all([
        api.get('/projects'),
        api.get('/users/activity')
      ]);
      const data = projRes.data;
      setProjects(Array.isArray(data) ? data : data.items || []);
      setActivities(actRes.data || []);
    } catch (err) {
      addToast('Failed to load dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setCreateLoading(true);
    try {
      const response = await api.post('/projects', {
        name: newProjectName,
        description: newProjectDesc
      });
      setProjects(prev => [response.data, ...prev]);
      // Refetch activity to show "Created project"
      const actRes = await api.get('/users/activity');
      setActivities(actRes.data || []);

      setNewProjectName('');
      setNewProjectDesc('');
      setIsCreating(false);
      addToast('Project created successfully.', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to create project', 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = useCallback(async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
      // Refetch activity
      const actRes = await api.get('/users/activity');
      setActivities(actRes.data || []);
      addToast('Project deleted.', 'success');
    } catch (err) {
      addToast('Failed to delete project', 'error');
    }
  }, [addToast]);

  return (
    <Layout>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px', alignItems: 'start' }} className="dashboard-grid">
        {/* Main Content: Projects */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--slate-900)' }}>Projects</h1>
              <p className="text-muted text-sm" style={{ marginTop: '4px' }}>Manage your ongoing work</p>
            </div>
            <Button onClick={() => setIsCreating(!isCreating)} variant={isCreating ? 'secondary' : 'primary'}>
              {isCreating ? 'Cancel' : '+ New Project'}
            </Button>
          </div>

          {isCreating && (
            <div className="animate-fade-in" style={{ marginBottom: '32px' }}>
              <Card>
                <Card.Content>
                  <form onSubmit={handleCreate} style={{ display: 'grid', gap: '16px' }}>
                    <h3 className="text-lg font-medium">Create New Project</h3>
                    <Input
                      placeholder="Project Name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      autoFocus
                      required
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={newProjectDesc}
                      onChange={(e) => setNewProjectDesc(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button type="submit" loading={createLoading}>Create Project</Button>
                    </div>
                  </form>
                </Card.Content>
              </Card>
            </div>
          )}

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{
                width: '24px',
                height: '24px',
                border: '2px solid var(--slate-300)',
                borderTopColor: 'var(--primary-600)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 12px'
              }} />
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div style={{
              border: '2px dashed var(--slate-200)',
              borderRadius: 'var(--radius-lg)',
              padding: '60px',
              textAlign: 'center',
              backgroundColor: 'var(--slate-50)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--slate-100)',
                color: 'var(--slate-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--slate-700)' }}>No projects yet</h3>
              <p className="text-muted" style={{ marginTop: '8px', marginBottom: '24px', maxWidth: '300px' }}>
                Get started by creating your first project to organize tasks and track progress.
              </p>
              <Button onClick={() => setIsCreating(true)} variant="primary">Create Project</Button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Activity */}
        <div className="activity-sidebar">
          <h3 style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px', letterSpacing: '0.05em' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activities.length === 0 ? (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No recent activity.</div>
            ) : (
              activities.map(act => (
                <div key={act.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    marginTop: '4px',
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: act.action === 'completed' ? 'var(--semantic-success)' : act.action === 'deleted' ? 'var(--semantic-error)' : 'var(--primary-500)'
                  }} />
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--slate-700)', lineHeight: '1.4' }}>
                      <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{act.action}</span> {act.target_type}
                      {act.details?.title && ` "${act.details.title}"`}
                      {act.details?.name && ` "${act.details.name}"`}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--slate-400)', marginTop: '2px' }}>
                      {new Date(act.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .activity-sidebar { margin-top: 40px; border-top: 1px solid var(--slate-200); padding-top: 32px; }
        }
      `}</style>
    </Layout>
  );
}

export default Dashboard;
