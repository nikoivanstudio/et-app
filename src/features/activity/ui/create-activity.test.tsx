import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CreateActivity } from './create-activity';

vi.mock('../hooks/use-create-activity', () => ({
  useCreateActivity: () => vi.fn()
}));

vi.mock('@/entities/form-dialog', () => ({
  FormDialog: ({ triggerButton }: { triggerButton: string }) => (
    <button>{triggerButton}</button>
  )
}));

describe('CreateActivity', () => {
  it('renders create activity trigger button', () => {
    render(<CreateActivity />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

