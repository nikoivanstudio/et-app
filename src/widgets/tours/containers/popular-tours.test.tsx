import { render, screen } from '@testing-library/react';
import { PopularTours } from './popular-tours';
import { ReactNode } from 'react';

jest.mock('@/features/tour/server', () => ({
  tourService: {
    getPopularTourCards: jest.fn(async () => [{ id: 1, title: 'Popular' }])
  }
}));

jest.mock('@/widgets/tours/ui/server-tour-card-list', () => ({
  ServerTourCardList: () => <div data-testid='server-tour-card-list' />
}));

jest.mock('@/widgets/tours/ui/server-layout', () => ({
  ServerLayout: ({ list, title }: { list: ReactNode; title?: ReactNode }) => (
    <div>
      {title}
      {list}
    </div>
  )
}));

describe('PopularTours', () => {
  it('renders popular tours list', async () => {
    const ui = await PopularTours();

    render(ui);

    expect(screen.getByTestId('server-tour-card-list')).toBeInTheDocument();
  });
});


