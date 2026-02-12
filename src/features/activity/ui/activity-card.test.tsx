import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ActivityCard } from './activity-card';

vi.mock('@/features/activity/api/activity-api', () => ({
  deleteActivity: vi.fn()
}));

vi.mock('@/entities/confirm-dialog', () => ({
  ConfirmDialog: ({ triggger }: { triggger: React.ReactNode }) => (
    <div>
      <span data-testid='confirm-dialog' />
      {triggger}
    </div>
  )
}));

vi.mock('@/shared/lib/date-utils', () => ({
  dateUtils: {
    getFormattedDate: () => '2026-01-01'
  }
}));

describe('ActivityCard', () => {
  it('renders title and description', () => {
    render(
      <ActivityCard
        {...({
          id: 1,
          title: 'Activity',
          description: 'Description',
          startTime: '2026-01-01',
          finishTime: '2026-01-02',
          personPrice: 10,
          groupPrice: 20,
          tour: { rating: 4 }
        } as unknown as Parameters<typeof ActivityCard>[0])}
      />
    );

    expect(screen.getByText('Activity')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
  });
});

