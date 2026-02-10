import { render, screen } from '@testing-library/react';
import { AllTours } from './all-tours';
import { ReactNode } from 'react';

jest.mock('@/features/tour/server', () => ({
  tourService: {
    getTourCards: jest.fn(async () => [{ id: 1, title: 'Tour' }])
  }
}));

jest.mock('@/widgets/tours/ui/server-tour-card-list', () => ({
  ServerTourCardList: () => <div data-testid='server-tour-card-list' />
}));

jest.mock('@/widgets/tours/ui/server-layout', () => ({
  ServerLayout: ({ list }: { list: ReactNode }) => <div>{list}</div>
}));

describe('AllTours', () => {
  it('renders server tour list', async () => {
    const ui = await AllTours();

    render(ui);

    expect(screen.getByTestId('server-tour-card-list')).toBeInTheDocument();
  });
});


