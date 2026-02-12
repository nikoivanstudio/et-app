import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UserCard } from './user-card';

vi.mock('@/entities/confirm-dialog', () => ({
  ConfirmDialog: () => <div data-testid='confirm-dialog' />
}));

describe('UserCard', () => {
  it('renders user login and id', () => {
    render(
      <UserCard
        user={
          {
            id: 1,
            login: 'user1',
            role: 'user',
            phone: '+1',
            firstName: 'John',
            lastName: 'Doe',
            avatarPhotoId: null,
            email: 'a@b.c',
            rating: 4
          } as unknown as Parameters<typeof UserCard>[0]['user']
        }
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('User ID:')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
  });
});

