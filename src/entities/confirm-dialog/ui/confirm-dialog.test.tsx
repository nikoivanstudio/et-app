import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { ConfirmDialog } from './confirm-dialog';

vi.mock('@/shared/ui/alert-dialog', () => ({
  AlertDialog: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTrigger: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogDescription: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogFooter: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogCancel: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogAction: ({
    children,
    onClick
  }: {
    children: ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>
}));

describe('ConfirmDialog', () => {
  it('renders content and triggers submit', () => {
    const onSubmit = vi.fn();

    render(
      <ConfirmDialog
        triggger={<button>Open</button>}
        onSubmit={onSubmit}
        title='Title'
        description='Description'
        cancelButton='Cancel'
        submitButton='Submit'
      />
    );

    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalled();
  });
});
