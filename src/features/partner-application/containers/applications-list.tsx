'use client';

import { FC } from 'react';

import { PartnerApplicationDomain } from '@/entities/partner-application';

import { cn } from '@/shared/lib/css';
import { Spinner } from '@/shared/ui/spinner';

import { useApplicationsList } from '../hooks/use-applications-list';
import { useReviewApplication } from '../hooks/use-review-application';
import { ApplicationCard } from '../ui/application-card';

export const ApplicationsList: FC = () => {
  const { data, isLoading, isFetching, error } = useApplicationsList();
  const { review, isPending } = useReviewApplication();

  const onApprove = (id: number) =>
    review({
      id,
      status: PartnerApplicationDomain.PartnerApplicationStatus.APPROVED
    });

  const onReject = (id: number) =>
    review({
      id,
      status: PartnerApplicationDomain.PartnerApplicationStatus.REJECTED
    });

  if (isLoading) {
    return (
      <div className='flex justify-center items-center w-full h-full min-h-96'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className='text-red-600'>{error.message}</div>;
  }

  if (!data?.applications?.length) {
    return <div className='text-muted-foreground'>Заявок пока нет</div>;
  }

  return (
    <ul className={cn('space-y-3', isFetching ? 'opacity-50' : '')}>
      {data.applications.map(application => (
        <li key={application.id}>
          <ApplicationCard
            application={application}
            isPending={isPending}
            onApprove={onApprove}
            onReject={onReject}
          />
        </li>
      ))}
    </ul>
  );
};
