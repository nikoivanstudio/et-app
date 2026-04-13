'use client';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { UserDomain } from '@/entities/user';

import { ClientLayout } from '../ui/client-layout';

const cnDashboardActivities = cn('DashboardActivities');

export const DashboardActivities: FC<{
  session: UserDomain.SessionEntity;
}> = () => (
  <ClientLayout
    className={cnDashboardActivities(null, ['mt-10'])}
    title={<div className='text-center'>Мероприятия</div>}
    // list={<ActivitiesList />}
    //TODO: поправить
    list={null}
    actions={
      <div
        className={cnDashboardActivities('Actions', ['mt-8', 'text-center'])}
      >
        TODO: поправить
        {/*<CreateActivity />*/}
      </div>
    }
  />
);
