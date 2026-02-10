import { render, screen } from '@testing-library/react';
import { PhotoSwiperLayout } from './layout';

jest.mock('@/widgets/photo-swiper/ui/photo-list', () => ({
  PhotoList: () => <div data-testid='photo-list' />
}));

describe('PhotoSwiperLayout', () => {
  it('renders photo list and footer text', () => {
    render(
      <PhotoSwiperLayout
        photos={[
          { title: 'One', source: '/one.jpg' },
          { title: 'Two', source: '/two.jpg' }
        ]}
      />
    );

    expect(screen.getByTestId('photo-list')).toBeInTheDocument();
    expect(screen.getByText(/Смотреть/iu)).toBeInTheDocument();
  });
});


