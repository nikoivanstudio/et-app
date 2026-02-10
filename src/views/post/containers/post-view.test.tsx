import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PostView } from './post-view';

vi.mock('@/views/post/ui/post-main', () => ({
  PostMain: () => <div data-testid='post-main' />
}));

describe('PostView', () => {
  it('renders post main when data is available', async () => {
    const ui = await PostView({
      either: {
        type: 'right',
        value: {
          id: 1,
          title: 'Post',
          content: '<p>content</p>',
          image: '/image.jpg'
        }
      }
    });

    render(ui);

    expect(screen.getByTestId('post-main')).toBeInTheDocument();
  });
});
