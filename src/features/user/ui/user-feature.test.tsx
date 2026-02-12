import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UserFeature } from './user-feature';

vi.mock('@/features/user/hooks/use-delete-user', () => ({
  useDeleteUser: () => vi.fn()
}));

vi.mock('@/features/user/ui/user-card', () => ({
  UserCard: ({ user }: { user: { login: string } }) => <div>{user.login}</div>
}));

describe('UserFeature', () => {
  it('renders user card', () => {
    render(
      <UserFeature
        user={{ id: 1, login: 'user' } as never}
      />
    );

    expect(screen.getByText('user')).toBeInTheDocument();
  });
});

