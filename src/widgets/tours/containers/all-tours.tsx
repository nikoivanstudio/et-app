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
      className={cnAllTours(null, ['text-center p-4'])}
      list={
        <ServerTourCardList
          className='mt-[30%] flex flex-col gap-10'
          tours={tours}
        />
      }
    />
  );
};
