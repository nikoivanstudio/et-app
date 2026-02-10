import { render, screen } from '@testing-library/react';
import { DashboardUsers } from './dashboard-users';
import { SessionEntity } from '@/entities/user/domain';
import { ReactNode } from 'react';

jest.mock('@/shared/ui/widget-layout.tsx', () => ({
  WidgetLayout: ({
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

jest.mock('@/features/user', () => ({
  UserFeatureList: () => <div data-testid='user-feature-list' />
}));

describe('DashboardUsers', () => {
  it('renders list and actions', () => {
    const session: SessionEntity = {
      id: 1,
      login: 'demo',
      phone: '+70000000000',
      role: 'USER',
      expiredAt: new Date().toISOString()
    };

    render(<DashboardUsers session={session} />);

    expect(screen.getByTestId('user-feature-list')).toBeInTheDocument();
    expect(screen.getByTestId('actions-slot')).toBeInTheDocument();
  });
});


