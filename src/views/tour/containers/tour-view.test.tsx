import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TourView } from './tour-view';

vi.mock('@/views/tour/ui/tour-main', () => ({
  TourMain: () => <div data-testid='tour-main' />
}));

vi.mock('@/kernel/tour/services/tour-services', () => ({
  tourServices: {
    getTourBySlug: vi.fn(async () => ({
      type: 'right',
      value: {
        id: 1,
        title: 'Tour',
        mainPhoto: '/image.jpg',
        rating: 4,
        price: 5000,
        duration: 120,
        photos: [],
        content: '<p>content</p>'
      }
    }))
  }
}));

describe('TourView', () => {
  it('renders tour main when data is available', async () => {
    const ui = await TourView({ params: Promise.resolve({ slug: 'tour-1' }) });

    render(ui);

    expect(screen.getByTestId('tour-main')).toBeInTheDocument();
  });
});
