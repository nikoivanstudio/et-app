import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CreateTourForm } from './create-tour-form';

vi.mock('@/entities/form-dialog', () => ({
  FormDialog: ({ title }: { title: string }) => <div>{title}</div>
}));

vi.mock('@/features/tour/hooks/use-create-tour', () => ({
  useCreateTour: () => vi.fn()
}));

describe('CreateTourForm', () => {
  it('renders form dialog title', () => {
    render(<CreateTourForm />);

    expect(screen.getByText('Создать тур')).toBeInTheDocument();
  });
});
