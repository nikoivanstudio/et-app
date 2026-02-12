import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FileItemsList } from './file-items-list';

vi.mock('@/features/file/ui/file-item', () => ({
  FileItem: ({ file }: { file: { originalFileName: string } }) => (
    <div>{file.originalFileName}</div>
  )
}));

describe('FileItemsList', () => {
  it('renders uploaded files list', () => {
    render(
      <FileItemsList
        files={[{ id: 1, originalFileName: 'a.txt' } as never]}
        fetchFiles={vi.fn(async () => undefined)}
        setFiles={vi.fn()}
        downloadUsingPresignedUrl={false}
      />
    );

    expect(screen.getByText('a.txt')).toBeInTheDocument();
  });
});

