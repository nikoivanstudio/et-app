import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ApplicationFormLayout } from './layout';

vi.mock('@/entities/form-dialog', () => ({
  FormDialog: ({ triggerButton }: { triggerButton: string }) => (
    <button>{triggerButton}</button>
  )
}));

describe('ApplicationFormLayout', () => {
  it('renders default trigger button', () => {
    render(<ApplicationFormLayout />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

