import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MockReviewsAvatars } from './index';

describe('MockReviewsAvatars', () => {
  it('renders rating and avatars', () => {
    render(<MockReviewsAvatars rating={4.7} />);

    expect(screen.getByTestId('mock-reviews-avatars')).toHaveTextContent('4.7');
  });
});
