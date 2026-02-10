import { render, screen } from '@testing-library/react';
import { DashboardPosts } from './dashboard-posts';
import { SessionEntity } from '@/entities/user/domain';
import { ReactNode } from 'react';

jest.mock('../ui/layout.tsx', () => ({
  Layout: ({ list, actions }: { list?: ReactNode; actions?: ReactNode }) => (
    <div>
      <div data-testid='list-slot'>{list}</div>
      <div data-testid='actions-slot'>{actions}</div>
    </div>
  )
}));

jest.mock('@/features/post', () => ({
  ExportPosts: () => <div data-testid='export-posts' />,
  PostFeatureList: () => <div data-testid='post-feature-list' />
}));

jest.mock('@/features/post/ui/feature-post', () => ({
  FeaturePost: () => <div data-testid='feature-post' />
}));

jest.mock('@/widgets/posts/ui/posts-migration', () => ({
  MigrationPosts: () => <div data-testid='migration-posts' />
}));

describe('DashboardPosts', () => {
  it('renders list and actions', () => {
    const session: SessionEntity = {
      id: 1,
      login: 'demo',
      phone: '+70000000000',
      role: 'USER',
      expiredAt: new Date().toISOString()
    };

    render(<DashboardPosts session={session} />);

    expect(screen.getByTestId('post-feature-list')).toBeInTheDocument();
    expect(screen.getByTestId('feature-post')).toBeInTheDocument();
    expect(screen.getByTestId('migration-posts')).toBeInTheDocument();
    expect(screen.getByTestId('export-posts')).toBeInTheDocument();
  });
});


