import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await register(formData.email, formData.password);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Register</h1>
        <p className="subtext">Create your account to manage projects.</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Choose a strong password"
          value={formData.password}
          onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
          minLength={6}
          required
        />

        {error ? <p className="message message-error">{error}</p> : null}
        {success ? <p className="message message-success">{success}</p> : null}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}

export default Register;
