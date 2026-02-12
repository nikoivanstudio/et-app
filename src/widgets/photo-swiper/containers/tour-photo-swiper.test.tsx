import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TourPhotoSwiper } from './tour-photo-swiper';

vi.mock('@/widgets/photo-swiper/ui/layout', () => ({
  PhotoSwiperLayout: () => <div data-testid='photo-swiper-layout' />
}));

describe('TourPhotoSwiper', () => {
  it('renders swiper layout', async () => {
    const ui = await TourPhotoSwiper({ photos: [{ title: '1', source: '/1.jpg' }] });

    render(ui);

    expect(screen.getByTestId('photo-swiper-layout')).toBeInTheDocument();
  });
});
