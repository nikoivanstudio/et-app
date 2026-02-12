import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardTours } from './dashboard-tours';

vi.mock('@/widgets/tours/ui/client-layout', () => ({
  ClientLayout: ({
    list,
    actions
  }: {
    title: React.ReactNode;
    list?: React.ReactNode;
    className?: string;
    actions?: React.ReactNode;
  }) => (
    <div data-testid='client-layout'>
      {list}
      {actions}
    </div>
  )
}));

vi.mock('@/features/tour', () => ({
  __esModule: true,
  default: ({ triggerBtn }: { triggerBtn: React.ReactNode }) => (
    <div data-testid='tour-feature'>{triggerBtn}</div>
  ),
  TourFeatureList: () => <div data-testid='tour-feature-list' />
}));

describe('DashboardTours', () => {
  it('renders feature list and create action', () => {
    render(<DashboardTours session={{ id: 1 } as { id: number }} />);

    expect(screen.getByTestId('client-layout')).toBeInTheDocument();
    expect(screen.getByTestId('tour-feature-list')).toBeInTheDocument();
    expect(screen.getByTestId('tour-feature')).toBeInTheDocument();
  });
});
