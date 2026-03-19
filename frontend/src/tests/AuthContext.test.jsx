import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { AuthProvider, useAuth } from '../context/AuthContext';

const mockGet = vi.fn();
const mockPost = vi.fn();

vi.mock('../api/axios', () => ({
  default: {
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args),
  },
}));

function Consumer() {
  const { user, isAuthenticated } = useAuth();
  return (
    <div>
      <span data-testid="auth">{String(isAuthenticated)}</span>
      <span data-testid="email">{user?.email || ''}</span>
    </div>
  );
}

afterEach(() => {
  mockGet.mockReset();
  mockPost.mockReset();
  localStorage.clear();
});

test('bootstraps user from /users/me when token exists', async () => {
  localStorage.setItem('token', 'test-token');
  mockGet.mockResolvedValueOnce({ data: { id: 1, email: 'owner@example.com' } });

  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>,
  );

  expect(screen.getByTestId('auth')).toHaveTextContent('true');
  await waitFor(() => {
    expect(screen.getByTestId('email')).toHaveTextContent('owner@example.com');
  });
});

test('clears token when bootstrap request fails', async () => {
  localStorage.setItem('token', 'bad-token');
  mockGet.mockRejectedValueOnce(new Error('Unauthorized'));

  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>,
  );

  await waitFor(() => {
    expect(localStorage.getItem('token')).toBeNull();
  });
});
