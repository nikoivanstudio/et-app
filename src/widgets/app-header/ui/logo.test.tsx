import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Logo } from './logo';

vi.mock('@/shared/ui/logo-icon', () => ({
  LogoIcon: () => <div data-testid='logo-icon' />
}));

describe('Logo', () => {
  it('renders link with icon', async () => {
    const ui = await Logo();

    render(ui);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('logo-icon')).toBeInTheDocument();
  });
});
