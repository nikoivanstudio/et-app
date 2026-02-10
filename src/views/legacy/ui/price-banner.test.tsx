import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PriceBanner } from './price-banner';

describe('PriceBanner', () => {
  it('renders price rows', () => {
    const { container } = render(<PriceBanner />);

    const priceTexts = container.querySelectorAll('p');

    expect(priceTexts.length).toBe(6);
  });
});
