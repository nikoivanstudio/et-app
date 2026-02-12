import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HomePosts } from './home-posts';

vi.mock('../services/posts-services', () => ({
  postsServices: {
    getPostCards: vi.fn(async () => [{ id: 1, title: 'Post 1' }])
  }
}));

vi.mock('../ui/layout', () => ({
  Layout: ({
    title,
    list
  }: {
    title: React.ReactNode;
    list?: React.ReactNode;
    className?: string;
    actions?: React.ReactNode;
  }) => (
    <div data-testid='layout'>
      {title}
      {list}
    </div>
  )
}));

vi.mock('@/widgets/posts/ui/server-post-card-list', () => ({
  ServerPostCardList: () => <div data-testid='server-post-card-list' />
}));

describe('HomePosts', () => {
  it('renders posts widget', async () => {
    const ui = await HomePosts();

    render(ui);

    expect(screen.getByTestId('home-posts')).toBeInTheDocument();
  });
});
