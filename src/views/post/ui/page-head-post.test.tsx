import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PageHeadPost } from './page-head-post';

describe('PageHeadPost', () => {
  it('renders title', async () => {
    const ui = await PageHeadPost({
      id: 1,
      title: 'Post title',
      mainPhoto: '/image.jpg'
    });

    render(ui);

    expect(screen.getByText('Post title')).toBeInTheDocument();
  });
});
