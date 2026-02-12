import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ServerLayout } from './server-layout';

describe('ServerLayout', () => {
  it('renders title, list, and actions', async () => {
    const ui = await ServerLayout({
      title: <div data-testid='title' />,
      list: <div data-testid='list' />,
      actions: <div data-testid='actions' />
    });

    render(ui);

    expect(screen.getByTestId('title')).toBeInTheDocument();
    expect(screen.getByTestId('list')).toBeInTheDocument();
    expect(screen.getByTestId('actions')).toBeInTheDocument();
  });
});
