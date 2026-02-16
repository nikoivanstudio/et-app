import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import type { FormProps } from '@/entities/form-dialog/domain';
import { Form } from './form';

describe('Form', () => {
  it('submits updated data when validation passes', () => {
    const onSubmit = vi.fn();
    const schema = z.object({ name: z.string() });

    const formDataModel = [
      { type: 'string', label: 'Name', name: 'name' }
    ] satisfies FormProps<{ name: string }>['formDataModel'];

    const { container } = render(
      <Form
        initialData={{ name: 'John' }}
        formDataModel={formDataModel}
        onSubmit={onSubmit}
        schema={schema}
        type='put'
      />
    );

    fireEvent.change(screen.getByDisplayValue('John'), {
      target: { value: 'Jane' }
    });

    const form = container.querySelector('form');

    if (!form) {
      throw new Error('Form element not found');
    }

    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Jane' });
  });
});
