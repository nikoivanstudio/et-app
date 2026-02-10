import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PostMain } from './post-main';

vi.mock('@/views/post/ui/page-head-post', () => ({
  PageHeadPost: () => <div data-testid='page-head-post' />
}));

describe('PostMain', () => {
  it('renders post content', async () => {
    const ui = await PostMain({
      id: 1,
      title: 'Post',
      image: '/image.jpg',
      content: '<p>content</p>',
      metaDuration: 120,
      metaPrice: 5000
    });

    render(ui);

    expect(screen.getByTestId('page-head-post')).toBeInTheDocument();
    expect(screen.getByTestId('text-content')).toBeInTheDocument();
    expect(screen.getByTestId('badge-price')).toBeInTheDocument();
    expect(screen.getByTestId('duration-label')).toBeInTheDocument();
  });
});
