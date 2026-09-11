'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { ServerLayout } from '@/widgets/tours/ui/server-layout';

import { tourService } from '@/features/tour/server';

import { LegacyTourCard } from '@/shared/ui/legacy-tour-card';
import { LinkButton } from '@/shared/ui/link-button';
import { Title } from '@/shared/ui/title';

import { longTours } from '@/views/legacy/constants/tours';

import styles from '../assets/styles.module.scss';
import { ServerTourCardList } from '../ui/server-tour-card-list';

const cnPopularTours = cn('PopularTours');

/**
 * Блок «Популярные туры» на главной.
 *
 * Раньше при пустой базе здесь стояла заглушка с кнопкой на
 * `/category/vse_tury` — то есть главная страница сайта уводила
 * в легаси-каталог, один из семи конкурирующих (B7). Теперь и карточки,
 * и кнопка ведут в единственный каталог `/tours` (A5), а пока в базе
 * пусто, показываются легаси-маршруты: те самые, что фактически
 * продаются.
 */
export const PopularTours: FC = async () => {
  const tours = await tourService.getPopularTourCards();
  const legacyTours = tours.length ? [] : longTours.slice(0, 3);

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
          <ul className='mt-10 flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3'>
            {legacyTours.map(tour => (
              <li key={tour.href}>
                <LegacyTourCard tour={tour} />
              </li>
            ))}
          </ul>
        )
      }
      actions={
        <div className='mt-8'>
          <LinkButton className='w-full md:w-[260px]' href='/tours'>
            Все туры
          </LinkButton>
        </div>
      }
    />
  );
};
