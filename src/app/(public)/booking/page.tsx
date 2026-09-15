import type { Metadata } from 'next';
import { FC } from 'react';

import { MyBookingsView } from '@/views/my-bookings';

export const metadata: Metadata = { title: 'Мои заявки' };

const MyBookingsPage: FC = () => <MyBookingsView />;

export default MyBookingsPage;
