import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AppHeader } from './app-header';

vi.mock('@/widgets/app-header/ui/layout', () => ({
  Layout: ({
    nav,
    logo,
    rightNode
  }: {
    logo?: React.ReactNode;
    nav?: React.ReactNode;
    actions?: React.ReactNode;
    profile?: React.ReactNode;
    rightNode?: React.ReactNode;
    isStatic?: boolean;
  }) => (
    <div data-testid='layout'>
      {logo}
      {nav}
      {rightNode}
    </div>
  )
}));

vi.mock('@/widgets/app-header/ui/logo', () => ({
  Logo: () => <div data-testid='logo' />
}));

vi.mock('@/widgets/app-header/ui/main-nav', () => ({
  MainNav: () => <div data-testid='main-nav' />
}));

vi.mock('@/widgets/app-header/ui/contacts', () => ({
  Contacts: () => <div data-testid='contacts' />
}));

vi.mock('@/widgets/app-header/ui/profile', () => ({
  Profile: () => <div data-testid='profile' />
}));

vi.mock('@/features/theme/toogle-theme', () => ({
  ToggleTheme: () => <div data-testid='toggle-theme' />
}));

vi.mock('@/entities/user/server', () => ({
  sessionService: {
    verifySession: vi.fn(async () => ({ session: { id: 1 } }))
  }
}));

describe('AppHeader', () => {
  it('renders composed header parts', async () => {
    const ui = await AppHeader({ variant: 'public' });

    render(ui);

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByText('public')).toBeInTheDocument();
  });
});
