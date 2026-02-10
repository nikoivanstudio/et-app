import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardLayout from './layout';

vi.mock('@/entities/user/services/session', () => ({
  sessionService: {
    verifySessionWithRedirect: vi.fn(async () => ({
      session: { id: 1, role: 'SUPER_ADMIN' }
    }))
  }
}));

vi.mock('@/entities/user', () => ({
  roleUtils: {
    userHasPermissionOn: vi.fn(() => true)
  }
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}));

describe('Dashboard layout', () => {
  it('renders children when permissions are valid', async () => {
    const ui = await DashboardLayout({
      children: <div data-testid='child' />
    });

    render(ui);

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
