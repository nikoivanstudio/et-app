import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilesLibraryDashboard } from './files-library-dashboard';

vi.mock('@/widgets/files-library/ui/layout', () => ({
  FilesLibraryLayout: ({
    header,
    fileList
  }: {
    header?: React.ReactNode;
    fileList?: React.ReactNode;
    footer?: React.ReactNode;
  }) => (
    <div data-testid='files-layout'>
      {header}
      {fileList}
    </div>
  )
}));

vi.mock('@/features/file', () => ({
  FilesFeature: () => <div data-testid='files-feature' />
}));

describe('FilesLibraryDashboard', () => {
  it('renders files feature', () => {
    render(<FilesLibraryDashboard session={{ id: 1 } as { id: number }} />);

    expect(screen.getByTestId('files-layout')).toBeInTheDocument();
    expect(screen.getByTestId('files-feature')).toBeInTheDocument();
  });
});
