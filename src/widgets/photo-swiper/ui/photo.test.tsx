import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Photo } from './photo';

describe('Photo', () => {
  it('renders image with title alt', () => {
    render(<Photo title='Photo' source='/img.jpg' />);

    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Photo');
  });
});
