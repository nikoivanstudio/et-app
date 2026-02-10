import { render, screen } from '@testing-library/react';
import { FilesLibraryLayout } from './layout';

describe('FilesLibraryLayout', () => {
  it('renders header, list, and footer', () => {
    render(
      <FilesLibraryLayout
        header={<div>Header</div>}
        fileList={<div>Files</div>}
        footer={<div>Footer</div>}
      />
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Files')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});


