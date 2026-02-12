import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ExportPosts } from './export-posts';

describe('ExportPosts', () => {
  it('renders export button', () => {
    render(<ExportPosts />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

