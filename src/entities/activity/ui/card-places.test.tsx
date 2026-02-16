import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CardPlaces } from './card-places';

describe('CardPlaces', () => {
  it('renders number of free places', async () => {
    const ui = await CardPlaces({ freePlaces: 3 });

    render(ui);

    expect(screen.getByText(/3/)).toBeInTheDocument();
  });
});
