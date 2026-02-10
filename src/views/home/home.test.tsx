import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HomeView } from './home';

describe('HomeView', () => {
  it('renders main content blocks', async () => {
    const ui = await HomeView();

    render(ui);

    expect(screen.getByTestId('app-main')).toBeInTheDocument();
    expect(screen.getByTestId('popular-tours')).toBeInTheDocument();
    expect(screen.getByTestId('home-posts')).toBeInTheDocument();
    expect(screen.getByTestId('upcoming-activities')).toBeInTheDocument();
  });
});
