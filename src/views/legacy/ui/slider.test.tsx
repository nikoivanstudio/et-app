import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Slider } from './slider';

describe('Slider', () => {
  it('renders server slider with slides', async () => {
    const ui = await Slider({
      tours: [{ id: 1 }, { id: 2 }],
      title: 'Title'
    });

    render(ui);

    expect(screen.getByTestId('server-slider')).toBeInTheDocument();
    expect(screen.getAllByTestId('server-slide').length).toBe(2);
  });
});
