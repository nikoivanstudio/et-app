import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TourMain } from './tour-main';

describe('TourMain', () => {
  it('renders tour details', async () => {
    const ui = await TourMain({
      id: 1,
      title: 'Tour',
      mainPhoto: '/image.jpg',
      rating: 4.5,
      price: 5000,
      duration: 120,
      photos: [{ id: 1 }],
      content: '<p>content</p>'
    });

    render(ui);

    expect(screen.getByTestId('page-head-tour')).toBeInTheDocument();
    expect(screen.getByTestId('mock-reviews-avatars')).toBeInTheDocument();
    expect(screen.getByTestId('badge-price')).toBeInTheDocument();
    expect(screen.getByTestId('duration-label')).toBeInTheDocument();
    expect(screen.getByTestId('photo-swiper')).toBeInTheDocument();
    expect(screen.getByTestId('text-content')).toBeInTheDocument();
  });
});
