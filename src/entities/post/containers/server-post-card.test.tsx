import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ServerPostCard } from './server-post-card';

vi.mock('../ui/post-card', () => ({
  PostCard: ({ title }: { title: string }) => (
    <div data-testid='post-card'>{title}</div>
  )
}));

describe('ServerPostCard', () => {
  it('renders post card with title', async () => {
    const ui = await ServerPostCard({
      id: 1,
      slug: 'post',
      price: 10,
      images: [],
      title: 'Post',
      duration: 3600,
      metaPrice: null
    });

    render(ui);

    expect(screen.getByTestId('post-card')).toHaveTextContent('Post');
  });
});
