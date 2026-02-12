import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BottomLink } from './bottom-link';

describe('BottomLink', () => {
  it('renders text and link', () => {
    render(<BottomLink text='No account?' linkText='Sign up' url='/signup' />);

    expect(screen.getByText('No account?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute(
      'href',
      '/signup'
    );
  });
});

