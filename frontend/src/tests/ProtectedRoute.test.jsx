import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

function renderProtected(isAuthenticated) {
  useAuth.mockReturnValue({ isAuthenticated });
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>secure dashboard</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>login page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

test('renders protected content when authenticated', () => {
  renderProtected(true);
  expect(screen.getByText('secure dashboard')).toBeInTheDocument();
});

test('redirects to login when unauthenticated', () => {
  renderProtected(false);
  expect(screen.getByText('login page')).toBeInTheDocument();
});
