'use client';

import { FC } from 'react';

import { usePendingTours } from '@/features/tour/hooks/use-pending-tours';
import { useReviewTour } from '@/features/tour/hooks/use-review-tour';
import { ModerationTourCard } from '@/features/tour/ui/moderation-tour-card';

import { TourStatus } from '@/entities/tour/domain';

import { cn } from '@/shared/lib/css';
import { Spinner } from '@/shared/ui/spinner';

export const ModerationToursList: FC = () => {
  const { data, isLoading, isFetching, error } = usePendingTours();
  const { review, isPending } = useReviewTour();

  const onApprove = (id: number) =>
    review({ id, status: TourStatus.APPROVED });

  const onReject = (id: number, comment?: string) =>
    review({ id, status: TourStatus.REJECTED, comment });

  if (isLoading) {
    return (
      <div className='flex h-full min-h-96 w-full items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className='text-red-600'>{error.message}</div>;
  }

  if (!data?.tours?.length) {
    return <div className='text-muted-foreground'>Туров на модерации нет</div>;
  }

  return (
    <ul className={cn('space-y-3', isFetching ? 'opacity-50' : '')}>
      {data.tours.map(tour => (
        <li key={tour.id}>
          <ModerationTourCard
            tour={tour}
            isPending={isPending}
            onApprove={onApprove}
            onReject={onReject}
          />
        </li>
      ))}
    </ul>
  );
};
