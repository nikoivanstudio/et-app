import { render, screen } from '@testing-library/react';
import { ClientTourCardList } from './client-tour-card-list';

jest.mock('@tanstack/react-query', () => ({
  useInfiniteQuery: jest.fn(() => ({
    data: [{ title: 'Tour A' }]
  }))
}));

describe('ClientTourCardList', () => {
  it('renders tour titles from query', () => {
    render(<ClientTourCardList />);

    expect(screen.getByText('Tour A')).toBeInTheDocument();
  });
});


