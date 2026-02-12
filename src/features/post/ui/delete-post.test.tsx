import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DeletePost } from './delete-post';

vi.mock('@/features/post/hooks/use-delete-post', () => ({
  useDeletePost: () => vi.fn()
}));

vi.mock('@/entities/confirm-dialog', () => ({
  ConfirmDialog: () => <div data-testid='confirm-dialog' />
}));

describe('DeletePost', () => {
  it('renders confirm dialog', () => {
    render(<DeletePost id={1} />);

    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
  });
});

