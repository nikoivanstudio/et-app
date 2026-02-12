import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UploadFilesS3PresignedUrl } from './upload-files-s3-presigned-url';

vi.mock('@/features/file/ui/upload-files-form', () => ({
  UploadFilesForm: () => <div data-testid='upload-files-form' />
}));

describe('UploadFilesS3PresignedUrl', () => {
  it('renders shared upload form', () => {
    render(<UploadFilesS3PresignedUrl onUploadSuccess={vi.fn()} />);

    expect(screen.getByTestId('upload-files-form')).toBeInTheDocument();
  });
});

