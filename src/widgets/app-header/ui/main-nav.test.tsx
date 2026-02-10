import { render, screen } from '@testing-library/react';
import { MainNav } from './main-nav';
import { ReactNode } from 'react';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  )
}));

jest.mock('@/entities/user/services/session', () => ({
  sessionService: {
    verifySession: jest.fn(async () => ({ session: { id: 10 } }))
  }
}));

describe('MainNav', () => {
  it('adds profile link for authenticated users', async () => {
    const ui = await MainNav();

    render(ui);

    const links = screen.getAllByRole('link');
    expect(links.some(link => link.getAttribute('href') === '/account/10')).toBe(
      true
    );
  });
});



