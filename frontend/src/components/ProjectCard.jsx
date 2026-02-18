import React from 'react';
import { Link } from 'react-router-dom';

function ProjectCard({ project, onDelete }) {
  const handleDelete = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onDelete(project.id);
  };

  return (
    <Link to={`/projects/${project.id}`} className="project-card card">
      <h3>{project.name}</h3>
      <button type="button" className="btn btn-danger btn-sm" onClick={handleDelete}>
        Delete
      </button>
    </Link>
  );
}

export default ProjectCard;
