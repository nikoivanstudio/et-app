import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ActivityCardLayout } from './activity-card-layout';

describe('ActivityCardLayout', () => {
  it('renders content inside link', async () => {
    const ui = await ActivityCardLayout({
      id: 1,
      leftNode: <span>Left</span>,
      titleNode: <span>Title</span>,
      descriptionNode: <span>Description</span>
    });

    render(ui);

    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'activities?id=1'
    );
  });
});
