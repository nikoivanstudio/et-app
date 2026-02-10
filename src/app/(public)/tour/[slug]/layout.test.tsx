import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Layout from './layout';

vi.mock('@/views/tour/server', () => ({
  TourViewLayout: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid='tour-view-layout'>{children}</div>
  )
}));

describe('Tour slug layout', () => {
  it('renders children inside layout', async () => {
    const ui = await Layout({
      params: Promise.resolve({ slug: 'tour-1' }),
      children: <div data-testid='child' />
    });

    render(ui);

    expect(screen.getByTestId('tour-view-layout')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
