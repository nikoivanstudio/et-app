import { render, screen } from '@testing-library/react';
import { Pencil } from 'lucide-react';
import { z } from 'zod';

import { FormDialog } from '@/entities/form-dialog';

describe('FormDialog trigger', () => {
  const baseProps = {
    initialData: {},
    formDataModel: [],
    onSubmit: jest.fn(),
    schema: z.object({})
  };

  it('wraps icon triggers into a clickable button', () => {
    render(
      <FormDialog
        {...baseProps}
        triggerButton={<Pencil data-testid='edit-icon' className='size-4' />}
      />
    );

    const trigger = screen.getByRole('button');

    expect(trigger).toContainElement(screen.getByTestId('edit-icon'));
  });
});
