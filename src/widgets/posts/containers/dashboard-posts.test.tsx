import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardPosts } from './dashboard-posts';

vi.mock('../ui/layout', () => ({
  Layout: ({
    list,
    actions
  }: {
    title: React.ReactNode;
    list?: React.ReactNode;
    className?: string;
    actions?: React.ReactNode;
  }) => (
    <div data-testid='layout'>
      {list}
      {actions}
    </div>
  )
}));

vi.mock('@/features/post', () => ({
  PostFeatureList: () => <div data-testid='post-feature-list' />,
  ExportPosts: () => <div data-testid='export-posts' />
}));

vi.mock('@/features/post/ui/feature-post', () => ({
  FeaturePost: () => <div data-testid='feature-post' />
}));

vi.mock('@/widgets/posts/ui/posts-migration', () => ({
  MigrationPosts: () => <div data-testid='migration-posts' />
}));

describe('DashboardPosts', () => {
  it('renders dashboard post controls', () => {
    render(<DashboardPosts session={{ id: 1 } as { id: number }} />);

    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('post-feature-list')).toBeInTheDocument();
    expect(screen.getByTestId('feature-post')).toBeInTheDocument();
    expect(screen.getByTestId('migration-posts')).toBeInTheDocument();
    expect(screen.getByTestId('export-posts')).toBeInTheDocument();
  });
});
