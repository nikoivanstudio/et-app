'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { tourService } from '@/features/tour/server';

import { ServerLayout } from '../ui/server-layout';
import { ServerTourCardList } from '../ui/server-tour-card-list';

const cnAllTours = cn('AllTours');

export const AllTours: FC = async () => {
  const tours = await tourService.getTourCards();

  return (
    <ServerLayout
      className={cnAllTours(null, [
        'mx-auto max-w-[1120px] px-4 pb-20 text-center'
      ])}
      list={
        <ServerTourCardList
          className='flex flex-col gap-12 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3'
          tours={tours}
        />
      }
    />
  );
};
