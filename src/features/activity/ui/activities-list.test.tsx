import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ActivitiesList } from './activities-list';

vi.mock('@/features/activity/hooks/use-activity-list', () => ({
  useActivityList: () => ({
    data: { activities: [{ id: 1, title: 'A1' }] },
    isFetching: false,
    tools: <div data-testid='tools' />,
    cursor: <div data-testid='cursor' />
  })
}));

vi.mock('../containers/activity-feature', () => ({
  ActivityFeature: ({ title }: { title: string }) => <div>{title}</div>
}));

describe('ActivitiesList', () => {
  it('renders tools and activities from hook data', () => {
    render(<ActivitiesList />);

    expect(screen.getByTestId('tools')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByTestId('cursor')).toBeInTheDocument();
  });
});

