import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Content } from './content';

vi.mock('@/views/legacy/ui/video', () => ({
  Video: () => <div data-testid='legacy-video' />
}));

vi.mock('@/views/legacy/ui/slider', () => ({
  Slider: () => <div data-testid='legacy-slider' />
}));

vi.mock('@/views/legacy/constants/tours', () => ({
  longTours: [{ id: 1 }],
  shortTours: [{ id: 2 }]
}));

describe('Content', () => {
  it('renders media blocks and text content', async () => {
    const ui = await Content();

    render(ui);

    expect(screen.getByTestId('legacy-video')).toBeInTheDocument();
    expect(screen.getAllByTestId('legacy-slider').length).toBe(2);
    expect(screen.getByTestId('text-content')).toBeInTheDocument();
  });
});
