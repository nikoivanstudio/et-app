import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UploadMode } from './upload-mode';

vi.mock('@/shared/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({ value }: { value: string }) => <div>{value}</div>,
  SelectLabel: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <span>{placeholder}</span>
  )
}));

describe('UploadMode', () => {
  it('renders available upload modes', () => {
    render(
      <UploadMode value='s3PresignedUrl' onChange={vi.fn()} />
    );

    expect(screen.getByText('s3PresignedUrl')).toBeInTheDocument();
    expect(screen.getByText('NextjsAPIEndpoint')).toBeInTheDocument();
  });
});
