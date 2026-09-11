'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { ServerLayout } from '@/widgets/tours/ui/server-layout';

import { tourService } from '@/features/tour/server';

import { EmptyState } from '@/shared/ui/empty-state';
import { LinkButton } from '@/shared/ui/link-button';
import { Title } from '@/shared/ui/title';

import styles from '../assets/styles.module.scss';
import { ServerTourCardList } from '../ui/server-tour-card-list';

const cnPopularTours = cn('PopularTours');

export const PopularTours: FC = async () => {
  const tours = await tourService.getPopularTourCards();

  return (
    <ServerLayout
      className={cnPopularTours(null, [
        'mx-auto max-w-[1120px] px-4 text-center',
        styles.PopularTours
      ])}
      title={
        <Title type='h2' className={cnPopularTours('Title')}>
          Популярные туры
        </Title>
      }
      list={
        /* Пока в базе нет ни одного тура, здесь оставалось 280px белого
           места между заголовком и следующим блоком. */
        tours.length ? (
          <ServerTourCardList
            className='mt-10 flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3'
            tours={tours}
          />
        ) : (
          <EmptyState
            className='mt-8'
            title='Собираем расписание на сезон'
            text='Готовые маршруты с ценами и длительностью уже есть в каталоге — оттуда можно записаться на любую дату.'
            action={
              <LinkButton
                className='w-full md:w-[260px]'
                href='/category/vse_tury'
              >
                Смотреть каталог
              </LinkButton>
            }
          />
        )
      }
    />
  );
};
