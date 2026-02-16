import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { ActivityCard } from './activity-card';

vi.mock('@/entities/activity/ui/activity-card-layout', () => ({
  ActivityCardLayout: ({
    leftNode,
    titleNode,
    descriptionNode
  }: {
    leftNode: ReactNode;
    titleNode: ReactNode;
    descriptionNode: ReactNode;
    id: number;
    className?: string;
  }) => (
    <div data-testid='activity-card-layout'>
      <div data-testid='left-node'>{leftNode}</div>
      <div data-testid='title-node'>{titleNode}</div>
      <div data-testid='description-node'>{descriptionNode}</div>
    </div>
  )
}));

vi.mock('@/entities/activity/ui/card-dates', () => ({
  CardDates: () => <span>dates</span>
}));

vi.mock('@/entities/activity/ui/card-title', () => ({
  CardTitle: ({ title }: { title: ReactNode }) => <span>{title}</span>
}));

vi.mock('@/entities/activity/ui/card-description', () => ({
  CardDescription: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  )
}));

vi.mock('@/entities/activity/ui/card-places', () => ({
  CardPlaces: ({ freePlaces }: { freePlaces: number }) => (
    <span>{freePlaces}</span>
  )
}));

vi.mock('@/entities/activity/ui/card-price', () => ({
  CardPrice: ({ price }: { price: number }) => <span>{price}</span>
}));

describe('ActivityCard', () => {
  it('composes layout with card parts', async () => {
    const ui = await ActivityCard({
      id: 1,
      title: 'Activity',
      startTime: new Date(2026, 0, 1),
      finishTime: new Date(2026, 0, 2),
      freePlaces: 3,
      price: 120
    });

    render(ui);

    expect(screen.getByTestId('activity-card-layout')).toBeInTheDocument();
    expect(screen.getByText('dates')).toBeInTheDocument();
    expect(screen.getByText('Activity')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
  });
});
