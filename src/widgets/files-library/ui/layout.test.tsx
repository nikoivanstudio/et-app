import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FilesLibraryLayout } from './layout';

describe('FilesLibraryLayout', () => {
  it('renders header, file list, and footer', () => {
    render(
      <FilesLibraryLayout
        header={<div data-testid='header' />}
        fileList={<div data-testid='file-list' />}
        footer={<div data-testid='footer' />}
      />
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('file-list')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
