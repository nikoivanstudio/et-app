import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UserFeatureList } from './users-feature-list';

vi.mock('../hooks/use-user-list', () => ({
  useUserList: () => ({
    data: { users: [{ id: 1, login: 'user-1' }] },
    isFetching: false,
    tools: <div data-testid='tools' />,
    pagination: <div data-testid='pagination' />,
    cursor: <div data-testid='cursor' />
  })
}));

vi.mock('./user-feature', () => ({
  UserFeature: ({ user }: { user: { login: string } }) => <div>{user.login}</div>
}));

describe('UserFeatureList', () => {
  it('renders users from hook data', () => {
    render(<UserFeatureList session={{ id: 1 } as never} />);

    expect(screen.getByTestId('tools')).toBeInTheDocument();
    expect(screen.getByText('user-1')).toBeInTheDocument();
    expect(screen.getByTestId('cursor')).toBeInTheDocument();
  });
});
