import { render, screen } from '@testing-library/react';
import { Photo } from './photo';
import { ReactNode } from 'react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt
  }: {
    src: string;
    alt: string;
    children?: ReactNode;
  }) => <img src={src} alt={alt} />
}));

describe('Photo', () => {
  it('renders image with alt text', () => {
    render(<Photo title='Tour' source='/tour.jpg' />);

    const image = screen.getByRole('img', { name: 'Tour' });
    expect(image).toHaveAttribute('src', '/tour.jpg');
  });
});


