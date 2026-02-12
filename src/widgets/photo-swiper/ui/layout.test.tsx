import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PhotoSwiperLayout } from './layout';

vi.mock('@/widgets/photo-swiper/ui/photo-list', () => ({
  PhotoList: () => <div data-testid='photo-list' />
}));

describe('PhotoSwiperLayout', () => {
  it('renders photo list', () => {
    render(<PhotoSwiperLayout photos={[{ title: '1', source: '/1.jpg' }]} />);

    expect(screen.getByTestId('photo-list')).toBeInTheDocument();
  });
});
