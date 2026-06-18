'use client';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { ApplicationsList } from '@/features/partner-application';

import { WidgetLayout } from '@/shared/ui/widget-layout';

const cnDashboardApplications = cn('DashboardApplications');

export const DashboardApplications: FC = () => (
  <WidgetLayout
    className={cnDashboardApplications()}
    title={<h2 className='mb-3 text-lg font-medium'>Заявки на партнёрство</h2>}
    list={<ApplicationsList />}
  />
);
