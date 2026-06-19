'use client';

import { FC } from 'react';

import { AdminBookingsList } from '@/features/booking';

import { WidgetLayout } from '@/shared/ui/widget-layout';

export const DashboardAllBookings: FC = () => (
  <WidgetLayout
    className='p-4'
    title={
      <h2 className='mb-3 text-lg font-medium'>Все заявки на туры · по гидам</h2>
    }
    list={<AdminBookingsList />}
  />
);
