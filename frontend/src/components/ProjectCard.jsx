
import React from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';

function ProjectCard({ project, onDelete }) {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      onDelete(project.id);
    }
  };

  const date = new Date(project.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <Card style={{ height: '100%', transition: 'transform 0.1s', cursor: 'pointer', position: 'relative' }}>
        <Card.Content>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', minHeight: '80px' }}>
            <div style={{ paddingRight: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--slate-900)', marginBottom: '4px' }}>
                {project.name}
              </h3>
              <p className="text-sm text-muted" style={{ lineHeight: '1.5' }}>
                {project.description || 'No description provided.'}
              </p>
            </div>

            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-xs text-muted">Created {date}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              style={{ color: 'var(--danger-text)', padding: '4px 8px', height: 'auto' }}
            >
              Delete
            </Button>
          </div>
        </Card.Content>
      </Card>
    </Link>
  );
}

export default ProjectCard;
