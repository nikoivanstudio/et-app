import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PostFeatureList } from './post-feature-list';

vi.mock('@/features/post/hooks/use-post-list', () => ({
  usePostList: () => ({
    data: { posts: [{ id: 1, title: 'Post 1' }] },
    isFetching: false,
    tools: <div data-testid='tools' />,
    pagination: <div data-testid='pagination' />,
    cursor: <div data-testid='cursor' />
  })
}));

vi.mock('@/features/post/ui/post-card', () => ({
  PostCard: ({ title }: { title: string }) => <div>{title}</div>
}));

describe('PostFeatureList', () => {
  it('renders list with post card', () => {
    render(<PostFeatureList session={{ id: 1 } as never} />);

    expect(screen.getByTestId('tools')).toBeInTheDocument();
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByTestId('cursor')).toBeInTheDocument();
  });
});

