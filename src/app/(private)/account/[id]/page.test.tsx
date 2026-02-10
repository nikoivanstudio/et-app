import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Page from './page';

vi.mock('@/entities/user/services/get-current-user', () => ({
  getCurrentUser: vi.fn(async () => ({ id: 1, role: 'USER' }))
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}));

vi.mock('@/views/profile', () => ({
  ProfileView: () => <div data-testid='profile-view' />
}));

describe('Account page', () => {
  it('renders profile when user exists', async () => {
    const ui = await Page();

    render(ui);

    expect(screen.getByTestId('profile-view')).toBeInTheDocument();
  });
});
