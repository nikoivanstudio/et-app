import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ToursView } from './layout';

describe('ToursView', () => {
  it('renders all tours list', async () => {
    const ui = await ToursView();

    render(ui);

    expect(screen.getByTestId('app-main')).toBeInTheDocument();
    expect(screen.getByTestId('all-tours')).toBeInTheDocument();
  });
});
