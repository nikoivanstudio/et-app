import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Page from './page';

vi.mock('@/entities/user/server', () => ({
  sessionService: {
    verifySession: vi.fn(async () => ({
      session: { id: 1, role: 'GUIDE' }
    }))
  }
}));

vi.mock('@/views/dashboard/server', () => ({
  DashboardGuide: () => <div data-testid='dashboard-guide' />,
  DashboardSuperAdmin: () => <div data-testid='dashboard-super-admin' />
}));

describe('Dashboard page', () => {
  it('renders guide dashboard for guide session', async () => {
    const ui = await Page();

    render(ui);

    expect(screen.getByTestId('dashboard-guide')).toBeInTheDocument();
  });
});
