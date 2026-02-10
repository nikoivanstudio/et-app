import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardGuide } from './dashboard-guide';

vi.mock('@/widgets/tours', () => ({
  DashboardTours: ({ session }: { session: unknown }) => (
    <div data-testid='dashboard-tours'>{JSON.stringify(session)}</div>
  )
}));

vi.mock('@/widgets/activities', () => ({
  DashboardActivities: ({ session }: { session: unknown }) => (
    <div data-testid='dashboard-activities'>{JSON.stringify(session)}</div>
  )
}));

vi.mock('@/views/dashboard/ui/dashboard-layout', () => ({
  DashboardLayout: ({
    children
  }: {
    children?: React.ReactNode;
    className?: string;
    type?: string;
  }) => <div data-testid='dashboard-layout'>{children}</div>
}));

describe('DashboardGuide', () => {
  it('renders guide dashboard layout', async () => {
    const ui = await DashboardGuide({
      session: { id: 1, role: 'GUIDE' },
      children: <div data-testid='child' />
    });

    render(ui);

    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-tours')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-activities')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
