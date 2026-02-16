import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DurationLabelLayout } from './duration-label-layout';

vi.mock('@/shared/ui/clock-icon', () => ({
  ClockIcon: () => <span data-testid='clock-icon' />
}));

vi.mock('@/shared/ui/black-clock-icon', () => ({
  BlackClockIcon: () => <span data-testid='black-clock-icon' />
}));

describe('DurationLabelLayout', () => {
  it('renders duration with black icon', () => {
    render(<DurationLabelLayout duration={7200} color='black' />);

    expect(screen.getByTestId('black-clock-icon')).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });
});
