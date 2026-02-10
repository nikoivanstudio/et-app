import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProfileView } from './profile-view';
import type { UserDomain } from '@/entities/user';

vi.mock('@/views/profile/ui/profile-view-layout', () => ({
  ProfileLayout: () => <div data-testid='profile-layout' />
}));

describe('ProfileView', () => {
  it('renders profile layout', () => {
    const user = {
      id: 1,
      role: 'SUPER_ADMIN'
    } as unknown as UserDomain.UserEntity;

    render(
      <ProfileView user={user} />
    );

    expect(screen.getByTestId('profile-layout')).toBeInTheDocument();
  });
});
