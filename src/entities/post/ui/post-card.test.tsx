import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { PostCard } from './post-card';

vi.mock('@/entities/favourite', () => ({
  FavouriteLabel: () => <div data-testid='favourite-label' />
}));

vi.mock('@/entities/rating/server', () => ({
  ServerRatingLabel: () => <div data-testid='rating-label' />
}));

vi.mock('@/entities/duration/server', () => ({
  ServerDurationLabel: ({ duration }: { duration: number | string }) => (
    <div data-testid='duration-label'>{duration}</div>
  )
}));

vi.mock('@/shared/ui/arrow-link-icon', () => ({
  ArrowLinkIcon: () => <span data-testid='arrow-icon' />
}));

vi.mock('@/shared/ui/badge-price', () => ({
  BadgePrice: ({ price }: { price: number | string }) => (
    <div data-testid='badge-price'>{price}</div>
  )
}));

vi.mock('@/shared/ui/card-layout', () => ({
  CardLayout: ({
    title,
    cardHeader,
    cardFooter,
    bgImage
  }: {
    title: string;
    cardHeader: ReactNode;
    cardFooter: ReactNode;
    bgImage: string;
  }) => (
    <div data-testid='card-layout' data-bg={bgImage}>
      <div data-testid='card-title'>{title}</div>
      <div data-testid='card-header'>{cardHeader}</div>
      <div data-testid='card-footer'>{cardFooter}</div>
    </div>
  )
}));

vi.mock('@/shared/ui/link-button', () => ({
  LinkButton: ({
    href,
    children
  }: {
    href: string;
    children?: ReactNode;
  }) => (
    <a data-testid='link-button' href={href}>
      {children}
    </a>
  )
}));

vi.mock('@/shared/ui/card-header', () => ({
  CardHeader: ({
    leftNode,
    rightNode
  }: {
    leftNode: ReactNode;
    rightNode: ReactNode;
  }) => (
    <div data-testid='card-header'>
      <div data-testid='card-header-left'>{leftNode}</div>
      <div data-testid='card-header-right'>{rightNode}</div>
    </div>
  )
}));

vi.mock('@/shared/ui/card-footer', () => ({
  CardFooter: ({
    leftNode,
    rightNode
  }: {
    leftNode: ReactNode;
    rightNode: ReactNode;
  }) => (
    <div data-testid='card-footer'>
      <div data-testid='card-footer-left'>{leftNode}</div>
      <div data-testid='card-footer-right'>{rightNode}</div>
    </div>
  )
}));

vi.mock('@/shared/assets/images/backgrounds/bg-1.jpg', () => ({
  default: 'reserve'
}));

describe('PostCard', () => {
  it('renders main card parts', async () => {
    const ui = await PostCard({
      id: 1,
      slug: 'post',
      price: 100,
      images: [],
      title: 'Post title',
      duration: 3600,
      metaPrice: null
    });

    render(ui);

    expect(screen.getByTestId('badge-price')).toHaveTextContent('100');
    expect(screen.getByTestId('duration-label')).toHaveTextContent('3600');
    expect(screen.getByTestId('link-button')).toHaveAttribute('href', '/post');
    expect(screen.getByTestId('favourite-label')).toBeInTheDocument();
    expect(screen.getByTestId('rating-label')).toBeInTheDocument();
  });
});
