import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ServerDurationLabel } from './server-duration-label';

vi.mock('@/entities/duration/ui/duration-label-layout', () => ({
  DurationLabelLayout: ({ duration }: { duration: string | number }) => (
    <div data-testid='duration-label'>{duration}</div>
  )
}));

describe('ServerDurationLabel', () => {
  it('renders layout with duration', async () => {
    const ui = await ServerDurationLabel({ duration: '3h' });

    render(ui);

    expect(screen.getByTestId('duration-label')).toHaveTextContent('3h');
  });
});
