import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MigrationPosts } from './posts-migration';

vi.mock('@/entities/form-dialog', () => ({
  FormDialog: () => <div data-testid='form-dialog' />,
  FormDialogDomain: {}
}));

vi.mock('@/features/post/model/create-posts-model', () => ({
  createPostsFormModel: []
}));

vi.mock('@/features/post/api/post-api', () => ({
  postApi: {
    createPostsByFile: vi.fn(async () => 'ok')
  }
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('MigrationPosts', () => {
  it('renders migration form', () => {
    render(<MigrationPosts />);

    expect(screen.getByTestId('form-dialog')).toBeInTheDocument();
  });
});
