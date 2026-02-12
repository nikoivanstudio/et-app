import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TourFeatureList } from './tour-feature-list';

vi.mock('@/features/tour/hooks/use-tour-list', () => ({
  useTourList: () => ({
    data: { tours: [{ id: 1, title: 'Tour 1' }] },
    isFetching: false,
    tools: <div data-testid='tools' />,
    pagination: <div data-testid='pagination' />,
    cursor: <div data-testid='cursor' />
  })
}));

vi.mock('@/features/tour', () => ({
  TourCard: ({ title }: { title: string }) => <div>{title}</div>
}));

describe('TourFeatureList', () => {
  it('renders tours from hook data', () => {
    render(<TourFeatureList />);

    expect(screen.getByTestId('tools')).toBeInTheDocument();
    expect(screen.getByText('Tour 1')).toBeInTheDocument();
    expect(screen.getByTestId('cursor')).toBeInTheDocument();
  });
});

