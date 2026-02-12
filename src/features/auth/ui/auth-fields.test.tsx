import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthFields } from './auth-fields';

describe('AuthFields', () => {
  it('renders login and password inputs', () => {
    render(<AuthFields />);

    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
  });
});
