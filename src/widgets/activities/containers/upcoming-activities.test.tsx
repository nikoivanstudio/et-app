import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UpcomingActivities } from './upcoming-activities';

vi.mock('@/widgets/activities/services/get-upcoming-activities', () => ({
  getUpcomingActivities: vi.fn(async () => [
    {
      id: 1,
      title: 'Activity',
      places: 10,
      personPrice: 1000,
      startTime: '2026-01-01',
      finishTime: '2026-01-02',
      participants: []
    }
  ])
}));

vi.mock('@/widgets/activities/lib/dates-helpers', () => ({
  getActivitiesDates: () => []
}));

vi.mock('@/widgets/activities/ui/activities-layout', () => ({
  ActivitiesLayout: ({
    content
  }: {
    title: string;
    content: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
  }) => <div data-testid='activities-layout'>{content}</div>
}));

vi.mock('@/entities/activity/server', () => ({
  ActivityCard: ({ title }: { title: string }) => (
    <div data-testid='activity-card'>{title}</div>
  )
}));

vi.mock('@/widgets/activities/ui/months', () => ({
  Months: () => <span data-testid='months' />
}));

describe('UpcomingActivities', () => {
  it('renders activities list', async () => {
    const ui = await UpcomingActivities();

    render(ui);

    expect(screen.getByTestId('activities-layout')).toBeInTheDocument();
    expect(screen.getByTestId('activity-card')).toBeInTheDocument();
  });
});
