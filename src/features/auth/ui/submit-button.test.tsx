import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SubmitButton } from './submit-button';

describe('SubmitButton', () => {
  it('renders submit button text', () => {
    render(<SubmitButton>Send</SubmitButton>);

    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });
});

