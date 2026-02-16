import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { PageHeadTour } from './page-head-type-tour';

vi.mock('@/entities/page-head/ui/page-head-layout', () => ({
  PageHeadLayout: ({
    title,
    content
  }: {
    title: ReactNode;
    content: ReactNode;
  }) => (
    <div data-testid='page-head-layout'>
      {title}
      {content}
    </div>
  )
}));

vi.mock('@/shared/ui/title', () => ({
  Title: ({ children }: { children?: ReactNode }) => (
    <h1>{children}</h1>
  )
}));

vi.mock('@/entities/geo-point', () => ({
  GeoPoint: () => <div data-testid='geo-point' />
}));

describe('PageHeadTour', () => {
  it('renders title and geo point', async () => {
    const ui = await PageHeadTour({
      id: 1,
      title: 'Tour',
      mainPhoto: '/photo.jpg'
    });

    render(ui);

    expect(screen.getByText('Tour')).toBeInTheDocument();
    expect(screen.getByTestId('geo-point')).toBeInTheDocument();
    expect(screen.getByAltText('Tour')).toBeInTheDocument();
  });
});
