import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DashboardLayout } from './dashboard-layout';

describe('DashboardLayout', () => {
  it('renders header and children', async () => {
    const ui = await DashboardLayout({
      children: <div data-testid='child' />,
      className: 'test',
      type: 'guide'
    });

    render(ui);

    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
