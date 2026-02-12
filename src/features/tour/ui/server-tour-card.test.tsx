import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ServerTourCard } from './server-tour-card';

vi.mock('@/entities/favourite', () => ({
  FavouriteLabel: () => <div data-testid='favourite' />
}));

vi.mock('@/entities/rating/server', () => ({
  ServerRatingLabel: () => <div data-testid='rating' />
}));

vi.mock('@/entities/duration/server', () => ({
  ServerDurationLabel: ({ duration }: { duration: number }) => <div>{duration}</div>
}));

vi.mock('./link-button', () => ({
  LinkButton: ({ children }: { children: React.ReactNode }) => (
    <a href='/tour/slug'>{children}</a>
  )
}));

vi.mock('@/shared/ui/card-layout', () => ({
  CardLayout: ({ title }: { title: string }) => <div>{title}</div>
}));

vi.mock('@/shared/ui/card-header', () => ({
  CardHeader: () => <div />
}));

vi.mock('@/shared/ui/card-footer', () => ({
  CardFooter: () => <div />
}));

describe('ServerTourCard', () => {
  it('renders async server card title', async () => {
    const ui = await ServerTourCard({
      id: 1,
      title: 'Server tour',
      price: 100,
      rating: 5,
      duration: 2,
      mainPhoto: '/p.jpg',
      slug: 'slug'
    });
    render(ui);

    expect(screen.getByText('Server tour')).toBeInTheDocument();
  });
});

