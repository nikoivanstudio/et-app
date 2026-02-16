import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CardPrice } from './card-price';

describe('CardPrice', () => {
  it('renders price', async () => {
    const ui = await CardPrice({ price: 150 });

    render(ui);

    expect(screen.getByText(/150/)).toBeInTheDocument();
  });
});
