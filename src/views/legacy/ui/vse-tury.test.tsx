import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VseTury } from './vse-tury';

vi.mock('@/views/legacy/ui/header', () => ({
  Header: () => <div data-testid='legacy-header' />
}));

describe('VseTury', () => {
  it('renders tours list and footer', async () => {
    const ui = await VseTury({
      tours: [{ id: 1 }, { id: 2 }],
      children: <div data-testid='child' />
    });

    render(ui);

    expect(screen.getByTestId('legacy-header')).toBeInTheDocument();
    expect(screen.getAllByTestId('legacy-tour-card').length).toBe(2);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
