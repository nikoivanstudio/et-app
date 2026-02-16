import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ServerRatingLabel } from './server-rating-label';

vi.mock('@/entities/rating/ui/rating-label-layout', () => ({
  RatingLabelLayout: ({ rating }: { rating?: number }) => (
    <div data-testid='rating-label'>{rating}</div>
  )
}));

describe('ServerRatingLabel', () => {
  it('renders rating label layout', async () => {
    const ui = await ServerRatingLabel({ rating: 4.2 });

    render(ui);

    expect(screen.getByTestId('rating-label')).toHaveTextContent('4.2');
  });
});
