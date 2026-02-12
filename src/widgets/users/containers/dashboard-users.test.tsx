import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardUsers } from './dashboard-users';

vi.mock('@/features/user/', () => ({
  UserFeatureList: () => <div data-testid='user-feature-list' />
}));

vi.mock('@/shared/ui/widget-layout', () => ({
  WidgetLayout: ({
    list,
    actions
  }: {
    title: React.ReactNode;
    list?: React.ReactNode;
    className?: string;
    actions?: React.ReactNode;
  }) => (
    <div data-testid='widget-layout'>
      {list}
      {actions}
    </div>
  )
}));

describe('DashboardUsers', () => {
  it('renders users list and actions', () => {
    render(<DashboardUsers session={{ id: 1 } as { id: number }} />);

    expect(screen.getByTestId('widget-layout')).toBeInTheDocument();
    expect(screen.getByTestId('user-feature-list')).toBeInTheDocument();
    expect(screen.getByText(/создать/i)).toBeInTheDocument();
  });
});
