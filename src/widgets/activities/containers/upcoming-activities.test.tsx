import { render, screen } from '@testing-library/react';
import { UpcomingActivities } from './upcoming-activities';

jest.mock('@/widgets/activities/services/get-upcoming-activities', () => ({
  getUpcomingActivities: jest.fn(async () => [
    {
      id: 1,
      title: 'Activity',
      places: 5,
      personPrice: 100,
      startTime: new Date(),
      finishTime: new Date(),
      participants: []
    }
  ])
}));

jest.mock('@/widgets/activities/lib/dates-helpers', () => ({
  getActivitiesDates: jest.fn(() => [])
}));

jest.mock('@/entities/activity/server', () => ({
  ActivityCard: () => <div data-testid='activity-card' />
}));

jest.mock('@/widgets/activities/ui/months', () => ({
  Months: () => <span data-testid='months' />
}));

describe('UpcomingActivities', () => {
  it('renders upcoming activity cards', async () => {
    const ui = await UpcomingActivities();

    render(ui);

    expect(screen.getByTestId('months')).toBeInTheDocument();
    expect(screen.getByTestId('activity-card')).toBeInTheDocument();
  });
});


