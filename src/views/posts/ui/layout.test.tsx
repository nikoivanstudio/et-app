import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PostsView } from './layout';

vi.mock('@/widgets/posts/services/posts-services', () => ({
  postsServices: {
    getPaginatedPostCards: vi.fn(async () => ({
      type: 'right',
      value: {
        list: [{ id: 1 }],
        totalPages: 3
      }
    }))
  }
}));

vi.mock('@/views/posts/ui/pagination', () => ({
  Pagination: () => <div data-testid='pagination' />
}));

describe('PostsView', () => {
  it('renders list and pagination', async () => {
    const ui = await PostsView({ page: '2' });

    render(ui);

    expect(screen.getByTestId('post-card-list')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });
});
