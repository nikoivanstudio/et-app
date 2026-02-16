import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CardTitle } from './card-title';

describe('CardTitle', () => {
  it('renders title', async () => {
    const ui = await CardTitle({ title: 'Title' });

    render(ui);

    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});
