import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthFormLayout } from './auth-form-layout';

describe('AuthFormLayout', () => {
  it('renders title and description', () => {
    render(
      <AuthFormLayout
        title='Title'
        description='Description'
        fields={<div>Fields</div>}
        actions={<button>Submit</button>}
        error={<div>Error</div>}
        link={<a href='/'>Link</a>}
        action={vi.fn()}
      />
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
