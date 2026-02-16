import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageHeadLayout } from './page-head-layout';

describe('PageHeadLayout', () => {
  it('renders title and content', async () => {
    const ui = await PageHeadLayout({
      title: <div>Title</div>,
      content: <div>Content</div>
    });

    render(ui);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
