'use client';

import { FC } from 'react';

import { GuideBookingsList } from '@/features/booking';

import { WidgetLayout } from '@/shared/ui/widget-layout';

export const DashboardBookings: FC = () => (
  <WidgetLayout
    className='p-4'
    title={<h2 className='mb-3 text-lg font-medium'>Заявки на туры</h2>}
    list={<GuideBookingsList />}
  />
);
