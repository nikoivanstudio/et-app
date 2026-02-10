import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardSuperAdmin } from './dashboard-super-admin';

vi.mock('@/widgets/tours', () => ({
  DashboardTours: ({ session }: { session: unknown }) => (
    <div data-testid='dashboard-tours'>{JSON.stringify(session)}</div>
  )
}));

vi.mock('@/widgets/posts', () => ({
  DashboardPosts: ({ session }: { session: unknown }) => (
    <div data-testid='dashboard-posts'>{JSON.stringify(session)}</div>
  )
}));

vi.mock('@/widgets/users', () => ({
  DashboardUsers: ({ session }: { session: unknown }) => (
    <div data-testid='dashboard-users'>{JSON.stringify(session)}</div>
  )
}));

vi.mock('@/widgets/files-library', () => ({
  FilesLibraryDashboard: ({ session }: { session: unknown }) => (
    <div data-testid='files-library'>{JSON.stringify(session)}</div>
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

describe('DashboardSuperAdmin', () => {
  it('renders tabs with dashboard widgets', async () => {
    const ui = await DashboardSuperAdmin({
      session: { id: 1, role: 'SUPER_ADMIN' },
      children: <div data-testid='child' />
    });

    render(ui);

    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-tours')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-posts')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-users')).toBeInTheDocument();
    expect(screen.getByTestId('files-library')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
