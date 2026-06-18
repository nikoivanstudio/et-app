'use client';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { ModerationToursList } from '@/features/tour';

import { WidgetLayout } from '@/shared/ui/widget-layout';

const cnDashboardTourModeration = cn('DashboardTourModeration');

export const DashboardTourModeration: FC = () => (
  <WidgetLayout
    className={cnDashboardTourModeration()}
    title={
      <h2 className='mb-3 text-lg font-medium'>Туры на модерации</h2>
    }
    list={<ModerationToursList />}
  />
);
