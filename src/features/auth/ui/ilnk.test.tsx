import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BottomLink } from './ilnk';

describe('BottomLink (ilnk)', () => {
  it('renders legacy link component', () => {
    render(<BottomLink text='Already have account?' linkText='Sign in' url='/' />);

    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/'
    );
  });
});

