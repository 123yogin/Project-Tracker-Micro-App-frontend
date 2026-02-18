
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import AuthLayout from '../components/AuthLayout';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await register(formData.email, formData.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const errorData = err.response?.data;
      setError(errorData?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card>
        <Card.Header
          title="Create an account"
          description="Start managing your projects in minutes"
        />
        <Card.Content>
          <form onSubmit={handleSubmit}>
            <Input
              id="email"
              type="email"
              label="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@company.com"
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                id="password"
                type="password"
                label="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 8 chars"
                required
                minLength={8}
              />
              <Input
                id="confirmPassword"
                type="password"
                label="Confirm (again)"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter"
                required
              />
            </div>

            {error && (
              <div style={{
                color: 'var(--danger-text)',
                backgroundColor: 'var(--danger-bg)',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                marginBottom: '16px'
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
              Create account
            </Button>
          </form>
        </Card.Content>
        <Card.Footer>
          <p className="text-sm text-muted">
            Already have an account? <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: '600' }}>Log in</Link>
          </p>
        </Card.Footer>
      </Card>
    </AuthLayout>
  );
}

export default Register;
