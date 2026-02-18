
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import AuthLayout from '../components/AuthLayout';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card>
        <Card.Header
          title="Welcome back"
          description="Sign in to your account to continue"
        />
        <Card.Content>
          <form onSubmit={handleSubmit}>
            <Input
              id="email"
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoFocus
            />
            <Input
              id="password"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <div style={{
                color: 'var(--danger-text)',
                backgroundColor: 'var(--danger-bg)',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                marginBottom: '16px',
                marginTop: '-8px'
              }}>
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              style={{ width: '100%' }}
            >
              Sign in
            </Button>
          </form>
        </Card.Content>
        <Card.Footer>
          <p className="text-sm text-muted">
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: '600' }}>Sign up</Link>
          </p>
        </Card.Footer>
      </Card>
    </AuthLayout>
  );
}

export default Login;
