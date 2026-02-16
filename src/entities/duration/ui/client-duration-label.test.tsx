import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ClientDurationLabel } from './client-duration-label';

vi.mock('@/entities/duration/ui/duration-label-layout', () => ({
  DurationLabelLayout: ({ duration }: { duration: string | number }) => (
    <div data-testid='duration-label'>{duration}</div>
  )
}));

describe('ClientDurationLabel', () => {
  it('renders layout with duration', () => {
    render(<ClientDurationLabel duration='2h' />);

    expect(screen.getByTestId('duration-label')).toHaveTextContent('2h');
  });
});
