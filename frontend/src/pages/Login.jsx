import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/*
 * FIX: Error response reads .data.error (matches backend), not .data.message.
 */
function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      // Read validation errors or flat error
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const messages = Object.values(errorData.errors).flat().join(' ');
        setError(messages || errorData.error || 'Login failed.');
      } else {
        setError(errorData?.error || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p className="subtext">Welcome back. Sign in to continue.</p>

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
          placeholder="Enter your password"
          value={formData.password}
          onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
          required
        />

        {error ? <p className="message message-error">{error}</p> : null}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p className="auth-link">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
