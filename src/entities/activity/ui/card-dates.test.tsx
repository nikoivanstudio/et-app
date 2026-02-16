import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CardDates } from './card-dates';

describe('CardDates', () => {
  it('renders formatted date range', () => {
    render(
      <CardDates startTime={new Date(2026, 0, 2)} finishTime={new Date(2026, 0, 10)} />
    );

    expect(screen.getByText('02-10')).toBeInTheDocument();
  });
});
