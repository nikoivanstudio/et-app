import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TourCard } from './tour-card';

vi.mock('@/features/tour/hooks/use-delete-tour', () => ({
  useDeleteTour: () => vi.fn()
}));

vi.mock('@/features/tour', () => ({
  __esModule: true,
  default: () => <div data-testid='tour-feature' />
}));

vi.mock('@/entities/confirm-dialog', () => ({
  ConfirmDialog: () => <div data-testid='confirm-dialog' />
}));

describe('TourCard', () => {
  it('renders tour title', () => {
    render(
      <TourCard
        {...({
          id: 1,
          title: 'Tour title',
          mainPhoto: { source: '/a.jpg', title: 'img' },
          content: 'content',
          rating: 4,
          price: 200,
          authorId: 1
        } as unknown as Parameters<typeof TourCard>[0])}
      />
    );

    expect(screen.getByText('Tour title')).toBeInTheDocument();
    expect(screen.getByTestId('tour-feature')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
  });
});

