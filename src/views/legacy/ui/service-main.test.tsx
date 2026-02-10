import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ServiceMain } from './service-main';

vi.mock('@/views/post/ui/page-head-post', () => ({
  PageHeadPost: () => <div data-testid='page-head-post' />
}));

describe('ServiceMain', () => {
  it('renders content and header', async () => {
    const ui = await ServiceMain({
      id: 1,
      title: 'Service',
      mainImage: '/image.jpg',
      content: '<p>content</p>'
    });

    render(ui);

    expect(screen.getByTestId('page-head-post')).toBeInTheDocument();
    expect(screen.getByTestId('text-content')).toBeInTheDocument();
    expect(screen.getByTestId('mock-reviews-avatars')).toBeInTheDocument();
  });
});
