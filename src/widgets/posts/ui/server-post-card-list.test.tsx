import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ServerPostCardList } from './server-post-card-list';

vi.mock('@/entities/post/server', () => ({
  ServerPostCard: ({ title }: { title: string }) => (
    <div data-testid='server-post-card'>{title}</div>
  ),
  PostDomain: {}
}));

describe('ServerPostCardList', () => {
  it('renders post cards', async () => {
    const ui = await ServerPostCardList({
      list: [
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' }
      ] as unknown as { id: number; title: string }[]
    });

    render(ui);

    expect(screen.getByTestId('post-card-list')).toHaveTextContent('2');
  });
});
