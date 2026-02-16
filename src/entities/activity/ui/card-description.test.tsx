import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CardDescription } from './card-description';

describe('CardDescription', () => {
  it('renders children', async () => {
    const ui = await CardDescription({ children: <span>Details</span> });

    render(ui);

    expect(screen.getByText('Details')).toBeInTheDocument();
  });
});
