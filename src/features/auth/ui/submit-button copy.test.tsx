import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorMessage } from './submit-button copy';

describe('ErrorMessage', () => {
  it('shows error text when error exists', () => {
    render(<ErrorMessage error='Invalid credentials' />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});

