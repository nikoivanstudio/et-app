'use server';

import { FC, PropsWithChildren } from 'react';

import { AppMain } from '@/widgets/app-main/server';

import { LegacyTourCardData } from '@/shared/model/types';
import { LegacyTourCard } from '@/shared/ui/legacy-tour-card';

import { getDurationBucket } from '@/views/legacy/lib/duration';
import { PriceBanner } from '@/views/legacy/ui/price-banner';
import { ToursFilterGrid } from '@/views/legacy/ui/tours-filter-grid';

import mainPhoto from '../assets/images/ekskursii.jpg';

import { Header } from './header';

export const VseTury: FC<
  PropsWithChildren<{ tours: LegacyTourCardData[]; totalCount: number }>
> = async ({ tours, totalCount, children }) => {
  const items = tours.map(tour => ({
    bucket: getDurationBucket(tour.duration),
    card: <LegacyTourCard tour={tour} />
  }));

  return (
    <AppMain
      mainHead={
        <Header
          variant='catalog'
          title='Все туры'
          kicker={`${totalCount} туров · Крым · выезд из Бахчисарая`}
          lead='Однодневные выезды на плато, в каньоны и пещерные города. Забираем от жилья, маршрут собираем под погоду.'
          mainPhoto={mainPhoto}
        />
      }
      mainContent={
        /* Единственное наложение: контент поднимается на 32px и закрывает
           фото скруглением сверху — как на главной и странице тура. */
        <div className='bg-page relative z-3 -mt-8 rounded-t-[32px] pt-6'>
          <div className='mx-auto max-w-[1120px] px-4 md:px-6'>
            <PriceBanner />
            <div className='mt-6 md:mt-8'>
              <ToursFilterGrid items={items} total={totalCount} />
            </div>
          </div>
        </div>
      }
      mainBottom={
        <div className='bg-page pb-16'>
          <div className='mx-auto max-w-[1120px] px-4'>{children}</div>
        </div>
      }
    />
  );
};
