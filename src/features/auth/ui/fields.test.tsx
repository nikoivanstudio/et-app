import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthFields } from './fields';

vi.mock('@/entities/otp', () => ({
  Otp: () => <div data-testid='otp' />
}));

vi.mock('next-turnstile', () => ({
  Turnstile: () => <div data-testid='turnstile' />
}));

describe('AuthFields', () => {
  it('renders otp for signup mode', () => {
    render(<AuthFields type='signup' />);

    expect(screen.getByTestId('otp')).toBeInTheDocument();
    expect(screen.getByTestId('turnstile')).toBeInTheDocument();
  });
});

