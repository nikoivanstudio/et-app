import { render, screen } from '@testing-library/react';
import { DashboardTours } from './dashboard-tours';
import { SessionEntity } from '@/entities/user/domain';
import { ReactNode } from 'react';

jest.mock('@/widgets/tours/ui/client-layout.tsx', () => ({
  ClientLayout: ({
    list,
    actions
  }: {
    list?: ReactNode;
    actions?: ReactNode;
  }) => (
    <div>
      <div data-testid='list-slot'>{list}</div>
      <div data-testid='actions-slot'>{actions}</div>
    </div>
  )
}));

jest.mock('@/features/tour', () => ({
  __esModule: true,
  default: () => <div data-testid='tour-feature' />,
  TourFeatureList: () => <div data-testid='tour-feature-list' />
}));

describe('DashboardTours', () => {
  it('renders list and actions', () => {
    const session: SessionEntity = {
      id: 1,
      login: 'demo',
      phone: '+70000000000',
      role: 'USER',
      expiredAt: new Date().toISOString()
    };

    render(<DashboardTours session={session} />);

    expect(screen.getByTestId('tour-feature-list')).toBeInTheDocument();
    expect(screen.getByTestId('tour-feature')).toBeInTheDocument();
  });
});


