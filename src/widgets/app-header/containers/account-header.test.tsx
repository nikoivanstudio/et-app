import { render, screen } from '@testing-library/react';
import { AccountHeader } from './account-header';
import { ReactNode } from 'react';

jest.mock('@/widgets/app-header/ui/layout.tsx', () => ({
  Layout: ({
    logo,
    nav,
    rightNode
  }: {
    logo?: ReactNode;
    nav?: ReactNode;
    rightNode?: ReactNode;
  }) => (
    <div>
      <div data-testid='logo-slot'>{logo}</div>
      <div data-testid='nav-slot'>{nav}</div>
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

describe('AccountHeader', () => {
  it('renders layout.tsx slots', async () => {
    const ui = await AccountHeader();

    render(ui);

    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('main-nav')).toBeInTheDocument();
    expect(screen.getByTestId('right-slot').querySelector('svg')).toBeTruthy();
  });
});


