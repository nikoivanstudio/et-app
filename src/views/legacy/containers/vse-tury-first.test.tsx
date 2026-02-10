import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { VseTuryFirst } from './vse-tury-first';

vi.mock('@/views/legacy/ui/vse-tury', () => ({
  VseTury: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid='vse-tury'>{children}</div>
  )
}));

vi.mock('@/views/legacy/constants/tours', () => ({
  firstPage: [{ id: 1 }]
}));

describe('VseTuryFirst', () => {
  it('renders pagination controls', () => {
    render(<VseTuryFirst />);

    expect(screen.getByTestId('vse-tury')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
