import { render, screen } from '@testing-library/react';
import { ServerTourCardList } from './server-tour-card-list';

jest.mock('@/features/tour/server', () => ({
  ServerTourCard: () => <div data-testid='server-tour-card' />
}));

describe('ServerTourCardList', () => {
  it('renders tour cards', async () => {
    const ui = await ServerTourCardList({
      tours: [
        { id: 1, title: 'One' },
        { id: 2, title: 'Two' }
      ]
    });

    render(ui);

    expect(screen.getAllByTestId('server-tour-card')).toHaveLength(2);
  });
});


