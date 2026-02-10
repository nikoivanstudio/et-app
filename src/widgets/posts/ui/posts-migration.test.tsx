import { render, screen } from '@testing-library/react';
import { MigrationPosts } from './posts-migration';

jest.mock('@/entities/form-dialog', () => ({
  FormDialog: ({ triggerButton }: { triggerButton?: string }) => (
    <button>{triggerButton}</button>
  ),
  FormDialogDomain: {}
}));

jest.mock('@/features/post/api/post-api', () => ({
  postApi: {
    createPostsByFile: jest.fn(async () => 'ok')
  }
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

describe('MigrationPosts', () => {
  it('renders migration trigger', () => {
    render(<MigrationPosts />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});


