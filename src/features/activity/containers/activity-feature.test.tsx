import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ActivityFeature } from './activity-feature';

vi.mock('@/shared/ui/feature-layout', () => ({
  FeatureLayout: ({
    title,
    children
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  )
}));

vi.mock('@/features/activity', () => ({
  ActivityCard: () => <div data-testid='activity-card' />
}));

describe('ActivityFeature', () => {
  it('renders activity card inside layout', () => {
    render(
      <ActivityFeature
        {...({
          id: 1,
          title: 'Activity title'
        } as unknown as Parameters<typeof ActivityFeature>[0])}
      />
    );

    expect(screen.getByText('Activity title')).toBeInTheDocument();
    expect(screen.getByTestId('activity-card')).toBeInTheDocument();
  });
});
