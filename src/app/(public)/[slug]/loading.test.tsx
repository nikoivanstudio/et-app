import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Loading from './loading';

vi.mock('@/views/loading/server', () => ({
  LoadingView: () => <div data-testid='loading-view' />
}));

describe('Post slug loading', () => {
  it('renders loading view', async () => {
    const ui = await Loading();

    render(ui);

    expect(screen.getByTestId('loading-view')).toBeInTheDocument();
  });
});
