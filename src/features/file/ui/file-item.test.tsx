import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FileItem } from './file-item';

vi.mock('@/features/file/lib/file-utils', () => ({
  fileUtils: {
    formatBytes: () => '10 KB'
  }
}));

describe('FileItem', () => {
  it('renders file name and formatted size', () => {
    render(
      <FileItem
        file={
          {
            id: 1,
            originalFileName: 'file.pdf',
            fileSize: 1000,
            isDeleting: false
          } as unknown as Parameters<typeof FileItem>[0]['file']
        }
        fetchFiles={vi.fn(async () => undefined)}
        setFiles={vi.fn()}
        downloadUsingPresignedUrl={false}
      />
    );

    expect(screen.getByText('file.pdf')).toBeInTheDocument();
    expect(screen.getByText('10 KB')).toBeInTheDocument();
  });
});

