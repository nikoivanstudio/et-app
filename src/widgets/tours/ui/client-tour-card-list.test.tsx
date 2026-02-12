import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ClientTourCardList } from './client-tour-card-list';

vi.mock('@tanstack/react-query', () => ({
  useInfiniteQuery: () => ({
    data: [{ id: 1, title: 'Tour 1' }, { id: 2, title: 'Tour 2' }]
  })
}));

describe('ClientTourCardList', () => {
  it('renders titles from query data', () => {
    render(<ClientTourCardList />);

    expect(screen.getByText('Tour 1')).toBeInTheDocument();
    expect(screen.getByText('Tour 2')).toBeInTheDocument();
  });
});
