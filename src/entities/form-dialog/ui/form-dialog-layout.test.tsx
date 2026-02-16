import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { z } from 'zod';
import { FormDialog } from './form-dialog-layout';

vi.mock('@/shared/ui/dialog', () => ({
  Dialog: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogDescription: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  )
}));

vi.mock('@/entities/form-dialog/ui/form', () => ({
  Form: ({ type }: { type: string }) => <div data-testid='form'>{type}</div>
}));

vi.mock('@/shared/ui/button', () => ({
  Button: ({ children }: { children?: ReactNode }) => <button>{children}</button>
}));

describe('FormDialog', () => {
  it('renders trigger and default form type', () => {
    render(
      <FormDialog
        triggerButton='Open'
        initialData={{}}
        formDataModel={[]}
        onSubmit={vi.fn()}
        schema={z.object({})}
      />
    );

    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByTestId('form')).toHaveTextContent('put');
  });
});
