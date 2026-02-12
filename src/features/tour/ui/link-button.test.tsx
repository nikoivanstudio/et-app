import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LinkButton } from './link-button';

describe('LinkButton', () => {
  it('renders link with children', () => {
    render(<LinkButton href='/tour/1'>Open</LinkButton>);

    expect(screen.getByRole('link', { name: 'Open' })).toHaveAttribute(
      'href',
      '/tour/1'
    );
  });
});

