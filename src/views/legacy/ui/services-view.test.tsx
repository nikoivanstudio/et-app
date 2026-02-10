import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ServicesView } from './services-view';

vi.mock('@/views/legacy/constants/services', () => ({
  services: [
    { id: 1, title: 'A', content: '<p>a</p>' },
    { id: 2, title: 'B', content: '<p>b</p>' }
  ]
}));

describe('ServicesView', () => {
  it('renders service cards', async () => {
    const ui = await ServicesView();

    render(ui);

    expect(screen.getByTestId('app-main')).toBeInTheDocument();
    expect(screen.getAllByTestId('legacy-tour-card').length).toBe(2);
  });
});
