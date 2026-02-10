import { render, screen } from '@testing-library/react';
import { Months } from './months';

jest.mock('@/widgets/activities/lib/dates-helpers', () => ({
  getMonthesTitle: jest.fn(() => 'MARCH')
}));

describe('Months', () => {
  it('renders computed month titles', () => {
    render(
      <Months
        dates={[
          { startTime: new Date('2024-03-01'), finishTime: new Date('2024-03-02') }
        ]}
      />
    );

    expect(screen.getByText('MARCH')).toBeInTheDocument();
  });
});


