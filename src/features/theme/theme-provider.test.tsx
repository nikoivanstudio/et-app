import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from './theme-provider';

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='next-theme-provider'>{children}</div>
  )
}));

describe('ThemeProvider', () => {
  it('renders children via next themes provider', () => {
    render(
      <ThemeProvider>
        <span>child</span>
      </ThemeProvider>
    );

    expect(screen.getByTestId('next-theme-provider')).toBeInTheDocument();
    expect(screen.getByText('child')).toBeInTheDocument();
  });
});

