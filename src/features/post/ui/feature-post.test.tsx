import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FeaturePost } from './feature-post';

vi.mock('@/entities/form-dialog', () => ({
  FormDialog: ({ title }: { title: string }) => <div>{title}</div>
}));

vi.mock('@/features/post/hooks/use-edit-post', () => ({
  useEditPost: () => vi.fn()
}));

vi.mock('@/features/post/hooks/use-create-post', () => ({
  useCreatePost: () => vi.fn()
}));

describe('FeaturePost', () => {
  it('renders dialog for create mode', () => {
    render(
      <FeaturePost
        type='create'
        session={{ id: 1 } as never}
      />
    );

    expect(screen.getByText('Создать пост')).toBeInTheDocument();
  });
});
