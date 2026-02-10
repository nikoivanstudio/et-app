import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Page from './page';

vi.mock('@/features/post/server', () => ({
  postServices: {
    getPostBySlug: vi.fn(async () => ({
      type: 'right',
      value: { id: 1 }
    })),
    getPostsSlugs: vi.fn(async () => [])
  }
}));

vi.mock('@/views/post/server', () => ({
  PostView: () => <div data-testid='post-view' />
}));

describe('Post slug page', () => {
  it('renders post view', async () => {
    const ui = await Page({ params: Promise.resolve({ slug: 'post-1' }) });

    render(ui);

    expect(screen.getByTestId('post-view')).toBeInTheDocument();
  });
});
