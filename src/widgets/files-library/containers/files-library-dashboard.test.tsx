import { render, screen } from '@testing-library/react';
import { FilesLibraryDashboard } from './files-library-dashboard';
import { SessionEntity } from '@/entities/user/domain';

describe('FilesLibraryDashboard', () => {
  it('renders files library layout.tsx', () => {
    const session: SessionEntity = {
      id: 1,
      login: 'demo',
      phone: '+70000000000',
      role: 'USER',
      expiredAt: new Date().toISOString()
    };

    render(<FilesLibraryDashboard session={session} />);

    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByText('FilesFeature')).toBeInTheDocument();
  });
});


