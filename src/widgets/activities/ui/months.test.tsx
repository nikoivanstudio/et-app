import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Months } from './months';

vi.mock('@/widgets/activities/lib/dates-helpers', () => ({
  getMonthesTitle: () => 'Январь'
}));

describe('Months', () => {
  it('renders month title', () => {
    render(<Months dates={[]} />);

    expect(screen.getByText('Январь')).toBeInTheDocument();
  });
});
