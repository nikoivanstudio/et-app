import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ServerTourCardList } from './server-tour-card-list';

vi.mock('@/features/tour/server', () => ({
  ServerTourCard: ({ title }: { title: string }) => (
    <div data-testid='server-tour-card'>{title}</div>
  )
}));

describe('ServerTourCardList', () => {
  it('renders tour cards', async () => {
    const ui = await ServerTourCardList({
      tours: [
        { id: 1, title: 'Tour 1' },
        { id: 2, title: 'Tour 2' }
      ] as unknown as { id: number; title: string }[],
      className: 'list'
    });

    render(ui);

    expect(screen.getAllByTestId('server-tour-card').length).toBe(2);
  });
});
