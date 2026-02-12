import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SignInForm } from './sign-in-form';

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

vi.mock('@/features/auth/ui/ilnk', () => ({
  BottomLink: () => <div />
}));

describe('SignInForm', () => {
  it('renders sign in layout', () => {
    render(<SignInForm />);

    expect(screen.getByText('Вход')).toBeInTheDocument();
  });
});
