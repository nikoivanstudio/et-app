import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TourFeature } from './tour-feature';

vi.mock('@/entities/form-dialog', () => ({
  FormDialog: ({ title }: { title: string }) => <div>{title}</div>
}));

vi.mock('@/features/tour/hooks/use-create-tour', () => ({
  useCreateTour: () => vi.fn()
}));

vi.mock('@/features/tour/hooks/use-edit-tour', () => ({
  useEditTour: () => vi.fn()
}));

describe('TourFeature', () => {
  it('renders dialog for create type', () => {
    render(<TourFeature type='create' authorId={1} />);

    expect(screen.getByText('Создать тур')).toBeInTheDocument();
  });
});
