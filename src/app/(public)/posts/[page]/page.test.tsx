import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Page from './page';

vi.mock('@/views/posts/server', () => ({
  PostsView: () => <div data-testid='posts-view' />
}));

describe('Posts page', () => {
  it('renders posts view', async () => {
    const ui = await Page({ params: Promise.resolve({ page: '2' }) });

    render(ui);

    expect(screen.getByTestId('posts-view')).toBeInTheDocument();
  });
});
