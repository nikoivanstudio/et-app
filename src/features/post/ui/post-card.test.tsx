import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PostCard } from './post-card';

vi.mock('@/features/post/ui/feature-post', () => ({
  FeaturePost: () => <div data-testid='feature-post' />
}));

vi.mock('@/features/post/ui/delete-post', () => ({
  DeletePost: () => <div data-testid='delete-post' />
}));

describe('PostCard', () => {
  it('renders post title', () => {
    render(
      <PostCard
        {...({
          id: 1,
          title: 'Post title',
          image: '',
          content: 'content',
          rating: 5,
          price: 100,
          session: { id: 1 }
        } as unknown as Parameters<typeof PostCard>[0])}
      />
    );

    expect(screen.getByText('Post title')).toBeInTheDocument();
    expect(screen.getByTestId('feature-post')).toBeInTheDocument();
    expect(screen.getByTestId('delete-post')).toBeInTheDocument();
  });
});

