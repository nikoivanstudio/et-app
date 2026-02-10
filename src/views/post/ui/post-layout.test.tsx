import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PostViewLayout } from './post-layout';

describe('PostViewLayout', () => {
  it('renders header, children, and footer', async () => {
    const ui = await PostViewLayout({
      params: Promise.resolve({ slug: 'test' }),
      children: <div data-testid='child' />
    });

    render(ui);

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByTestId('contacts-widget')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
