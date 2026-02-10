import { render, screen } from '@testing-library/react';
import { PhotoList } from './photo-list';

jest.mock('@/widgets/photo-swiper/ui/photo', () => ({
  Photo: ({ title }: { title: string }) => (
    <div data-testid='photo'>{title}</div>
  )
}));

describe('PhotoList', () => {
  it('renders up to three photos', async () => {
    const ui = await PhotoList({
      photos: [
        { title: 'One', source: '/one.jpg' },
        { title: 'Two', source: '/two.jpg' },
        { title: 'Three', source: '/three.jpg' },
        { title: 'Four', source: '/four.jpg' }
      ]
    });

    render(ui);

    expect(screen.getAllByTestId('photo')).toHaveLength(3);
  });
});


