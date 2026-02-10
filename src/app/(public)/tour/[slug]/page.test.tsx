import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Page from './page';

vi.mock('@/views/tour/server', () => ({
  TourView: () => <div data-testid='tour-view' />
}));

describe('Tour page', () => {
  it('renders tour view', async () => {
    const ui = await Page({ params: Promise.resolve({ slug: 'tour-1' }) });

    render(ui);

    expect(screen.getByTestId('tour-view')).toBeInTheDocument();
  });
});
