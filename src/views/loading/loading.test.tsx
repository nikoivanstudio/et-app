import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingView } from './loading';

describe('LoadingView', () => {
  it('renders skeleton placeholders', async () => {
    const ui = await LoadingView();

    render(ui);

    expect(screen.getAllByTestId('skeleton').length).toBe(6);
  });
});
