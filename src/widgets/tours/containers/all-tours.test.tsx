import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AllTours } from './all-tours';

vi.mock('@/features/tour/server', () => ({
  tourService: {
    getTourCards: vi.fn(async () => [{ id: 1, title: 'Tour 1' }])
  }
}));

vi.mock('../ui/server-layout', () => ({
  ServerLayout: ({ list }: { list?: React.ReactNode }) => (
    <div data-testid='server-layout'>{list}</div>
  )
}));

vi.mock('../ui/server-tour-card-list', () => ({
  ServerTourCardList: () => <div data-testid='server-tour-card-list' />
}));

describe('AllTours', () => {
  it('renders server layout with tour list', async () => {
    const ui = await AllTours();

    render(ui);

    expect(screen.getByTestId('server-layout')).toBeInTheDocument();
    expect(screen.getByTestId('server-tour-card-list')).toBeInTheDocument();
  });
});
