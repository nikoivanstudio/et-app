import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UploadFilesForm } from './upload-files-form';

describe('UploadFilesForm', () => {
  it('renders upload button when not loading', () => {
    render(
      <UploadFilesForm
        isLoading={false}
        fileInputRef={createRef<HTMLInputElement>()}
        uploadToServer={vi.fn()}
        maxFileSize={20}
      />
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

