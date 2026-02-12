import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SignUpForm } from './sign-up-form';

vi.mock('@/shared/lib/react', () => ({
  useActionState: () => [{ errors: { _errors: 'err' } }, vi.fn(), false]
}));

vi.mock('../ui/auth-form-layout', () => ({
  AuthFormLayout: ({ title }: { title: string }) => <div>{title}</div>
}));

vi.mock('../ui/fields', () => ({
  AuthFields: () => <div />
}));

vi.mock('../ui/submit-button', () => ({
  SubmitButton: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  )
}));

vi.mock('../ui/submit-button copy', () => ({
  ErrorMessage: () => <div />
}));

vi.mock('../ui/ilnk', () => ({
  BottomLink: () => <div />
}));

describe('SignUpForm', () => {
  it('renders sign up layout', () => {
    render(<SignUpForm />);

    expect(screen.getByText('Регистрация')).toBeInTheDocument();
  });
});
