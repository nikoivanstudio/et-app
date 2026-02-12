import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PopularTours } from './popular-tours';

vi.mock('@/features/tour/server', () => ({
  tourService: {
    getPopularTourCards: vi.fn(async () => [{ id: 1, title: 'Tour 1' }])
  }
}));

vi.mock('@/widgets/tours/ui/server-layout', () => ({
  ServerLayout: ({
    title,
    list
  }: {
    title?: React.ReactNode;
    list?: React.ReactNode;
  }) => (
    <div data-testid='server-layout'>
      {title}
      {list}
    </div>
  )
}));

vi.mock('../ui/server-tour-card-list', () => ({
  ServerTourCardList: () => <div data-testid='server-tour-card-list' />
}));

describe('PopularTours', () => {
  it('renders title and list', async () => {
    const ui = await PopularTours();

    render(ui);

    expect(screen.getByTestId('server-layout')).toBeInTheDocument();
    expect(screen.getByTestId('server-tour-card-list')).toBeInTheDocument();
  });
});
