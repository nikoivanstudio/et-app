import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PhotoList } from './photo-list';

vi.mock('@/widgets/photo-swiper/ui/photo', () => ({
  Photo: ({ title }: { title: string; source: string }) => (
    <div data-testid='photo'>{title}</div>
  )
}));

describe('PhotoList', () => {
  it('renders first 3 photos', async () => {
    const ui = await PhotoList({
      photos: [
        { title: '1', source: '/1.jpg' },
        { title: '2', source: '/2.jpg' },
        { title: '3', source: '/3.jpg' },
        { title: '4', source: '/4.jpg' }
      ]
    });

    render(ui);

    expect(screen.getAllByTestId('photo').length).toBe(3);
  });
});
