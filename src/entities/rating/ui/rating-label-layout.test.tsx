import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RatingLabelLayout } from './rating-label-layout';

vi.mock('@/shared/ui/star', () => ({
  Star: () => <span data-testid='star' />
}));

describe('RatingLabelLayout', () => {
  it('renders rating value and star', () => {
    render(<RatingLabelLayout rating={4.8} />);

    expect(screen.getByTestId('star')).toBeInTheDocument();
    expect(screen.getByText('4.8/5')).toBeInTheDocument();
  });
});
