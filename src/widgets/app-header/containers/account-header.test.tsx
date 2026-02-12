import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AccountHeader } from './account-header';

vi.mock('@/widgets/app-header/ui/layout', () => ({
  Layout: ({
    nav,
    logo
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
    </div>
  )
}));

vi.mock('@/widgets/app-header/ui/logo', () => ({
  Logo: () => <div data-testid='logo' />
}));

vi.mock('@/widgets/app-header/ui/main-nav', () => ({
  MainNav: () => <div data-testid='main-nav' />
}));

describe('AccountHeader', () => {
  it('renders account header layout', async () => {
    const ui = await AccountHeader();

    render(ui);

    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('main-nav')).toBeInTheDocument();
  });
});
