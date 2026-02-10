import { render, screen } from '@testing-library/react';
import { DashboardActivities } from './dashboard-activities';
import { SessionEntity } from '@/entities/user/domain';

const session: SessionEntity = {
  id: 1,
  login: 'demo',
  phone: '+70000000000',
  role: 'USER',
  expiredAt: new Date().toISOString()
};

describe('DashboardActivities', () => {
  it('renders action placeholder', () => {
    render(<DashboardActivities session={session} />);

    expect(screen.getByText(/TODO:/i)).toBeInTheDocument();
  });
});


