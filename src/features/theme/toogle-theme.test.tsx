import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ToggleTheme } from './toogle-theme';

const setTheme = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: () => ({ setTheme })
}));

vi.mock('@/shared/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => <button onClick={onClick}>{children}</button>
}));

describe('ToggleTheme', () => {
  it('sets light theme on click', async () => {
    const user = userEvent.setup();
    render(<ToggleTheme />);

    await user.click(screen.getByText('Светлая'));

    expect(setTheme).toHaveBeenCalledWith('light');
  });
});
