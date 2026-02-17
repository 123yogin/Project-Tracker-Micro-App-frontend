import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import api from '../api/axios';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/projects');
      setProjects(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (event) => {
    event.preventDefault();
    if (!projectName.trim()) return;

    try {
      const response = await api.post('/projects', { name: projectName.trim() });
      setProjects((prev) => [response.data, ...prev]);
      setProjectName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create project.');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete project.');
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="dashboard">
        <section className="card create-project-card">
          <h1>Your Projects</h1>
          <p className="subtext">Create and organize your project work in one place.</p>
          <form className="inline-form" onSubmit={handleCreateProject}>
            <input
              type="text"
              placeholder="New project name"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">
              Create Project
            </button>
          </form>
          {error ? <p className="message message-error">{error}</p> : null}
        </section>

        {loading ? (
          <p className="subtext">Loading projects...</p>
        ) : (
          <section className="project-grid">
            {projects.length === 0 ? (
              <article className="card empty-state">
                <p>No projects yet. Create your first project to get started.</p>
              </article>
            ) : (
              projects.map((project) => (
                <ProjectCard key={project.id} project={project} onDelete={handleDeleteProject} />
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
