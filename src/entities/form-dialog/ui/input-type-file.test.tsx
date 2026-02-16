import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InputTypeFile } from './input-type-file';

vi.mock('@/entities/form-dialog/ui/images-preview', () => ({
  ImagesPreview: () => <div data-testid='images-preview' />
}));

vi.mock('lucide-react', () => ({
  CircleX: () => <span data-testid='circle-x' />
}));

describe('InputTypeFile', () => {
  it('renders selected files and calls onChange', () => {
    const onChange = vi.fn();
    const file = new File(['test'], 'file.png', { type: 'image/png' });

    render(
      <InputTypeFile
        name='files'
        onChange={onChange}
        type='files'
        multiple
      />
    );

    const input = document.querySelector('input[type="file"]');

    if (!input) {
      throw new Error('File input not found');
    }

    fireEvent.change(input, {
      target: { files: [file], type: 'file' }
    });

    expect(onChange).toHaveBeenCalledWith({ files: [file] });
    expect(screen.getByText('file.png')).toBeInTheDocument();
    expect(screen.getByTestId('images-preview')).toBeInTheDocument();
  });
});
