'use client';

import { cn } from '@bem-react/classname';
import { PlusCircle } from 'lucide-react';
import { FC } from 'react';

import { ClientLayout } from '@/widgets/tours/ui/client-layout';

import TourFeature, { TourFeatureList } from '@/features/tour';

import { roleUtils } from '@/entities/user';
import { SessionDomain } from '@/entities/user/server';

const cnDashboardTours = cn('DashboardTours');

export const DashboardTours: FC<{
  session: SessionDomain.SessionEntity;
}> = ({ session }) => {
  // Администратор/супер-админ публикует тур сразу, гид — отправляет на модерацию.
  const autoPublish = roleUtils.userHasPermissionOn(session.role, 'reviewTour');

  return (
    <ClientLayout
      className={cnDashboardTours(null, ['p-4'])}
      title={null}
      list={<TourFeatureList />}
      actions={
        <TourFeature
          triggerBtn={
            <div className='flex justify-end items-center gap-2'>
              <div className='ml-auto text-lg'>Создать тур</div>
              <div>
                <PlusCircle size={10} />
              </div>
            </div>
          }
          type='create'
          authorId={session.id}
          autoPublish={autoPublish}
        />
      }
    />
  );
};
