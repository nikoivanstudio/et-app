import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Layout from './layout';

vi.mock('@/views/post/server', () => ({
  PostViewLayout: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid='post-view-layout'>{children}</div>
  )
}));

vi.mock('@/features/post/services/post-services', () => ({
  postServices: {
    getPostMetaDataBySlug: vi.fn(async () => ({
      type: 'right',
      value: { title: 'Post', description: 'Desc' }
    }))
  }
}));

describe('Post slug layout', () => {
  it('renders children inside layout', async () => {
    const ui = await Layout({
      params: Promise.resolve({ slug: 'post-1' }),
      children: <div data-testid='child' />
    });

    render(ui);

    expect(screen.getByTestId('post-view-layout')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
