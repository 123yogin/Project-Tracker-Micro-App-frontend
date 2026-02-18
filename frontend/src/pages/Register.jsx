import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/*
 * FIXES vs. original:
 * - Error response reads .data.error (matches backend), not .data.message.
 * - Handles marshmallow validation errors (.data.errors).
 * - Registration now auto-logins (AuthContext stores the token), so redirect to /dashboard.
 * - Added password confirmation field.
 */
function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await register(formData.email, formData.password);
      // AuthContext now stores the token automatically → go to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const messages = Object.values(errorData.errors).flat().join(' ');
        setError(messages || errorData.error || 'Registration failed.');
      } else {
        setError(errorData?.error || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Register</h1>
        <p className="subtext">Create your account to manage projects.</p>

        <label htmlFor="reg-email">Email</label>
        <input
          id="reg-email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
          required
        />

        <label htmlFor="reg-password">Password</label>
        <input
          id="reg-password"
          type="password"
          placeholder="Minimum 8 characters"
          value={formData.password}
          onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
          minLength={8}
          required
        />

        <label htmlFor="reg-confirm-password">Confirm Password</label>
        <input
          id="reg-confirm-password"
          type="password"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))
          }
          minLength={8}
          required
        />

        {error ? <p className="message message-error">{error}</p> : null}

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
