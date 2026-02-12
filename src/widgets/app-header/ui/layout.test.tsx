import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Layout } from './layout';

vi.mock('@/shared/ui/sheet', () => ({
  Sheet: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid='sheet'>{children}</div>
  ),
  SheetTrigger: ({ children }: { children?: React.ReactNode; asChild?: boolean }) => (
    <div>{children}</div>
  ),
  SheetContent: ({ children }: { children?: React.ReactNode; side?: string }) => (
    <div>{children}</div>
  ),
  SheetHeader: ({ children }: { children?: React.ReactNode; className?: string }) => (
    <div>{children}</div>
  ),
  SheetTitle: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>
}));

vi.mock('@/shared/ui/burger-icon', () => ({
  BurgerIcon: () => <div data-testid='burger-icon' />
}));

describe('Header Layout', () => {
  it('renders logo, nav, and right node', async () => {
    const ui = await Layout({
      logo: <div data-testid='logo' />,
      nav: <div data-testid='nav' />,
      rightNode: <div data-testid='right' />
    });

    render(ui);

    expect(screen.getByTestId('sheet')).toBeInTheDocument();
    expect(screen.getAllByTestId('logo').length).toBe(2);
    expect(screen.getByTestId('nav')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
    expect(screen.getByTestId('burger-icon')).toBeInTheDocument();
  });
});
