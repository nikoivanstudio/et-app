import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { VseTurySecond } from './vse-tury-second';

vi.mock('@/views/legacy/ui/vse-tury', () => ({
  VseTury: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid='vse-tury'>{children}</div>
  )
}));

vi.mock('@/views/legacy/constants/tours', () => ({
  secondPage: [{ id: 2 }]
}));

describe('VseTurySecond', () => {
  it('renders pagination controls', () => {
    render(<VseTurySecond />);

    expect(screen.getByTestId('vse-tury')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
