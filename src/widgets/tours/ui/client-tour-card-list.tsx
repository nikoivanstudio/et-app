'use client';

import { cn } from '@bem-react/classname';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FC } from 'react';

import { getTourCards } from '@/widgets/tours/api/tour-cards';

import { TourCardEntity } from '@/features/tour';

const cnClientTourCardList = cn('ClientTourCardList');

export const ClientTourCardList: FC = () => {
  const { data } = useInfiniteQuery({
    queryKey: ['tour', 'list'],
    queryFn: meta =>
      getTourCards<{ data: TourCardEntity[]; next?: number }>({
        page: meta.pageParam
      }),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.next,
    select: result => result.pages.flatMap(page => page.data)
  });

  return (
    <div className={cnClientTourCardList()}>
      <div>
        {data?.map((tourCard, idx) => <li key={idx}>{tourCard.title}</li>)}
      </div>
    </div>
  );
};
