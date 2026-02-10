import { render, screen } from '@testing-library/react';
import { DashboardHeader } from './dashboard-header';
import { ReactNode } from 'react';

jest.mock('@/widgets/app-header/ui/layout.tsx', () => ({
  Layout: ({
    logo,
    nav,
    profile,
    actions
  }: {
    logo?: ReactNode;
    nav?: ReactNode;
    profile?: ReactNode;
    actions?: ReactNode;
  }) => (
    <div>
      <div data-testid='logo-slot'>{logo}</div>
      <div data-testid='nav-slot'>{nav}</div>
      <div data-testid='profile-slot'>{profile}</div>
      <div data-testid='actions-slot'>{actions}</div>
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

describe('DashboardHeader', () => {
  it('renders profile for non-auth variant', async () => {
    const ui = await DashboardHeader({ variant: 'public' });

    render(ui);

    expect(screen.getByTestId('profile')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-theme')).toBeInTheDocument();
  });
});


