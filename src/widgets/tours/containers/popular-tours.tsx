'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { ServerLayout } from '@/widgets/tours/ui/server-layout';

import { tourService } from '@/features/tour/server';

import { Title } from '@/shared/ui/title';

import styles from '../assets/styles.module.scss';
import { ServerTourCardList } from '../ui/server-tour-card-list';

const cnPopularTours = cn('PopularTours');

export const PopularTours: FC = async () => {
  const tours = await tourService.getPopularTourCards();

  return (
    <ServerLayout
      className={cnPopularTours(null, ['text-center p-4', styles.PopularTours])}
      title={
        <Title type='h2' className={cnPopularTours('Title')}>
          Популярные туры
        </Title>
      }
      list={
        <ServerTourCardList
          className='mt-[10%] flex flex-col gap-10'
          tours={tours}
        />
      }
    />
  );
};
