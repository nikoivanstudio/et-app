import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MainNav } from './main-nav';

vi.mock('@/entities/user/services/session', () => ({
  sessionService: {
    verifySession: vi.fn(async () => ({ session: { id: 10 } }))
  }
}));

describe('MainNav', () => {
  it('renders profile link for authorized user', async () => {
    const ui = await MainNav();

    render(ui);

    expect(screen.getByRole('link', { name: /профиль/i })).toBeInTheDocument();
  });
});
