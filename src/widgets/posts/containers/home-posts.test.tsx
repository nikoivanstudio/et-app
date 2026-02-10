import { render, screen } from '@testing-library/react';
import { HomePosts } from './home-posts';

jest.mock('@/widgets/posts/services/posts-services', () => ({
  postsServices: {
    getPostCards: jest.fn(async () => [{ id: 1 }])
  }
}));

jest.mock('@/widgets/posts/ui/server-post-card-list', () => ({
  ServerPostCardList: () => <div data-testid='server-post-card-list' />
}));

describe('HomePosts', () => {
  it('renders server post card list', async () => {
    const ui = await HomePosts();

    render(ui);

    expect(screen.getByTestId('server-post-card-list')).toBeInTheDocument();
  });
});


