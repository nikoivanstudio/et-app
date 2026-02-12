import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UploadFilesRouteUrl } from './upload-files-route-url';

vi.mock('@/features/file/ui/upload-files-form', () => ({
  UploadFilesForm: () => <div data-testid='upload-files-form' />
}));

describe('UploadFilesRouteUrl', () => {
  it('renders shared upload form', () => {
    render(<UploadFilesRouteUrl onUploadSuccess={vi.fn()} />);

    expect(screen.getByTestId('upload-files-form')).toBeInTheDocument();
  });
});

