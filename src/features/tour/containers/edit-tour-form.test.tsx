import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EditTourModel } from './edit-tour-form';

vi.mock('@/entities/form-dialog', () => ({
  FormDialog: ({ title }: { title: string }) => <div>{title}</div>
}));

vi.mock('@/features/tour/hooks/use-create-tour', () => ({
  useCreateTour: () => vi.fn()
}));

describe('EditTourModel', () => {
  it('renders edit form dialog', () => {
    render(
      <EditTourModel
        data={{ id: 1, title: 'Tour' } as never}
      />
    );

    expect(screen.getByText('Создать тур')).toBeInTheDocument();
  });
});
