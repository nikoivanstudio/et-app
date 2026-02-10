import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TourViewLayout } from './tour-layout';

describe('TourViewLayout', () => {
  it('renders header, children, and footer', async () => {
    const ui = await TourViewLayout({
      params: Promise.resolve({ slug: 'tour-1' }),
      children: <div data-testid='child' />
    });

    render(ui);

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByTestId('contacts-widget')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
