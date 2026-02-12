import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppMain } from './app-main';

describe('AppMain', () => {
  it('renders head, content, and bottom blocks', async () => {
    const ui = await AppMain({
      mainHead: <div data-testid='head' />,
      mainContent: <div data-testid='content' />,
      mainBottom: <div data-testid='bottom' />
    });

    render(ui);

    expect(screen.getByTestId('head')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('bottom')).toBeInTheDocument();
  });
});
