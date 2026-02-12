import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Profile } from './profile';

vi.mock('@/shared/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid='dropdown'>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children?: React.ReactNode; asChild?: boolean }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children?: React.ReactNode; className?: string }) => (
    <div>{children}</div>
  ),
  DropdownMenuGroup: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    asChild?: boolean;
  }) => <button onClick={onClick}>{children}</button>,
  DropdownMenuLabel: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuSeparator: () => <hr />
}));

vi.mock('@/shared/ui/avatar', () => ({
  Avatar: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  AvatarFallback: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>
}));

describe('Profile', () => {
  it('renders profile menu items', () => {
    render(<Profile />);

    expect(screen.getByText(/мой аккаунт/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /профиль/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /выход/i })).toBeInTheDocument();
  });
});
