import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import Register from '../pages/Register';

const mockRegister = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ register: (...args) => mockRegister(...args) }),
}));

test('shows server connectivity message when registration request has no response', async () => {
  mockRegister.mockRejectedValueOnce(new Error('Network Error'));

  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  );

  fireEvent.change(screen.getByLabelText(/Email address/i), {
    target: { value: 'new@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/^Password$/i), {
    target: { value: 'StrongPass123!' },
  });
  fireEvent.change(screen.getByLabelText(/Confirm/i), {
    target: { value: 'StrongPass123!' },
  });

  fireEvent.click(screen.getByRole('button', { name: /Create account/i }));

  await waitFor(() => {
    expect(
      screen.getByText(/Cannot reach server\. Check backend is running/i),
    ).toBeInTheDocument();
  });
});
