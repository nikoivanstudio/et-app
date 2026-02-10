import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { JeepTourKrym } from './jeep-tour-krym';

vi.mock('@/views/legacy/ui/header', () => ({
  Header: () => <div data-testid='legacy-header' />
}));

vi.mock('@/views/legacy/ui/content', () => ({
  Content: () => <div data-testid='legacy-content' />
}));

describe('JeepTourKrym', () => {
  it('renders main blocks', async () => {
    const ui = await JeepTourKrym();

    render(ui);

    expect(screen.getByTestId('legacy-header')).toBeInTheDocument();
    expect(screen.getByTestId('legacy-content')).toBeInTheDocument();
  });
});
