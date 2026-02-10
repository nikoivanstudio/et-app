import { render, screen } from '@testing-library/react';
import { AppHeader } from './app-header';
import { ReactNode } from 'react';

jest.mock('@/entities/user/server', () => ({
  sessionService: {
    verifySession: jest.fn(() =>
      Promise.resolve({ isAuth: true, session: { id: 1 } })
    )
  }
}));

jest.mock('@/widgets/app-header/ui/layout.tsx', () => ({
  Layout: ({
    logo,
    nav,
    profile,
    actions,
    rightNode
  }: {
    logo?: ReactNode;
    nav?: ReactNode;
    profile?: ReactNode;
    actions?: ReactNode;
    rightNode?: ReactNode;
  }) => (
    <div>
      <div data-testid='logo-slot'>{logo}</div>
      <div data-testid='nav-slot'>{nav}</div>
      <div data-testid='profile-slot'>{profile}</div>
      <div data-testid='actions-slot'>{actions}</div>
      <div data-testid='right-slot'>{rightNode}</div>
    </div>
  )
}));

jest.mock('@/widgets/app-header/ui/logo', () => ({
  Logo: () => <div data-testid='logo' />
}));

jest.mock('@/widgets/app-header/ui/main-nav', () => ({
  MainNav: () => <nav data-testid='main-nav' />
}));

jest.mock('@/widgets/app-header/ui/profile', () => ({
  Profile: () => <div data-testid='profile' />
}));

jest.mock('@/features/theme/toogle-theme', () => ({
  ToggleTheme: () => <div data-testid='toggle-theme' />
}));

jest.mock('@/widgets/app-header/ui/contacts', () => ({
  Contacts: () => <div data-testid='contacts' />
}));

describe('AppHeader', () => {
  it('renders profile and action slots for non-auth variant', async () => {
    const ui = await AppHeader({ variant: 'public' });

    render(ui);

    expect(screen.getByTestId('profile')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-theme')).toBeInTheDocument();
    expect(screen.getByTestId('contacts')).toBeInTheDocument();
  });
});


