import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ActivitiesView } from './layout';

describe('ActivitiesView', () => {
  it('renders main blocks', async () => {
    const ui = await ActivitiesView();

    render(ui);

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByTestId('app-main')).toBeInTheDocument();
    expect(screen.getByTestId('popular-tours')).toBeInTheDocument();
    expect(screen.getByTestId('upcoming-activities')).toBeInTheDocument();
  });
});
