import { render, screen } from '@testing-library/react';
import { Logo } from './logo';
import { ReactNode } from 'react';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  )
}));

jest.mock('@/shared/ui/logo-icon', () => ({
  LogoIcon: () => <svg data-testid='logo-icon' />
}));

describe('Logo', () => {
  it('renders link to home', async () => {
    const ui = await Logo();

    render(ui);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });
});


