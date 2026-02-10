import { render, screen } from '@testing-library/react';
import { ServerPostCardList } from './server-post-card-list';

jest.mock('@/entities/post/server', () => ({
  ServerPostCard: () => <div data-testid='server-post-card' />
}));

describe('ServerPostCardList', () => {
  it('renders post cards', async () => {
    const ui = await ServerPostCardList({
      list: [{ id: 1 }, { id: 2 }]
    });

    render(ui);

    expect(screen.getAllByTestId('server-post-card')).toHaveLength(2);
  });
});


