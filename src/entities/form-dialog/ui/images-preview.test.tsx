import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ImagesPreview } from './images-preview';

describe('ImagesPreview', () => {
  it('renders preview images for valid files', () => {
    const original = URL.createObjectURL;
    const createObjectURL = vi.fn(() => 'blob:preview');
    URL.createObjectURL = createObjectURL;

    const file = new File(['test'], 'image.png', { type: 'image/png' });

    render(<ImagesPreview files={[file]} />);

    expect(screen.getByAltText('image.png')).toBeInTheDocument();

    URL.createObjectURL = original;
  });
});
