import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardActivities } from './dashboard-activities';

vi.mock('../ui/client-layout', () => ({
  ClientLayout: ({
    title,
    actions
  }: {
    title: React.ReactNode;
    list?: React.ReactNode;
    className?: string;
    actions?: React.ReactNode;
  }) => (
    <div data-testid='client-layout'>
      {title}
      {actions}
    </div>
  )
}));

describe('DashboardActivities', () => {
  it('renders dashboard layout', () => {
    render(<DashboardActivities session={{ id: 1 } as { id: number }} />);

    expect(screen.getByTestId('client-layout')).toBeInTheDocument();
    expect(screen.getByText(/TODO/i)).toBeInTheDocument();
  });
});
