import { render, screen } from '@testing-library/react';
import { TourPhotoSwiper } from './tour-photo-swiper';

jest.mock('@/widgets/photo-swiper/ui/layout.tsx', () => ({
  PhotoSwiperLayout: ({ photos }: { photos: { title: string }[] }) => (
    <div data-testid='photo-swiper-layout'>Photos: {photos.length}</div>
  )
}));

describe('TourPhotoSwiper', () => {
  it('passes photos to layout.tsx', async () => {
    const ui = await TourPhotoSwiper({
      photos: [
        { title: 'One', source: '/one.jpg' },
        { title: 'Two', source: '/two.jpg' }
      ]
    });

    render(ui);

    expect(screen.getByText('Photos: 2')).toBeInTheDocument();
  });
});


