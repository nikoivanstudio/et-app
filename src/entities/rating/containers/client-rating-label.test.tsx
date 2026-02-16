import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ClientRatingLabel } from './client-rating-label';

vi.mock('@/entities/rating/ui/rating-label-layout', () => ({
  RatingLabelLayout: ({ rating }: { rating?: number }) => (
    <div data-testid='rating-label'>{rating}</div>
  )
}));

describe('ClientRatingLabel', () => {
  it('renders rating label layout', () => {
    render(<ClientRatingLabel rating={4.5} />);

    expect(screen.getByTestId('rating-label')).toHaveTextContent('4.5');
  });
});
