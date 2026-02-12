import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilesFeature } from './files-feature';

vi.mock('@/shared/api/api-client', () => ({
  apiClient: {
    get: vi.fn(async () => [])
  }
}));

vi.mock('@/features/file/ui/upload-mode', () => ({
  UploadMode: () => <div data-testid='upload-mode' />
}));

vi.mock('@/features/file/ui/upload-files-s3-presigned-url', () => ({
  UploadFilesS3PresignedUrl: () => <div data-testid='s3-upload' />
}));

vi.mock('@/features/file/ui/upload-files-route-url', () => ({
  UploadFilesRouteUrl: () => <div data-testid='route-upload' />
}));

vi.mock('@/features/file/ui/file-items-list', () => ({
  FileItemsList: () => <div data-testid='file-list' />
}));

describe('FilesFeature', () => {
  it('renders upload mode and list', () => {
    render(<FilesFeature />);

    expect(screen.getByTestId('upload-mode')).toBeInTheDocument();
    expect(screen.getByTestId('s3-upload')).toBeInTheDocument();
    expect(screen.getByTestId('file-list')).toBeInTheDocument();
  });
});

