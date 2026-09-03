'use server';

import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/server';
import { AllTours } from '@/widgets/tours/server';

import { PageHeadLayout } from '@/entities/page-head/server';

export const ToursView: FC = async () => (
  <AppMain
    mainHead={
      <PageHeadLayout
        page='tours'
        title={null}
        content={
          /* Шапка каталога — 300px вместо целого экрана декора: счётчик,
             заголовок, и сразу под ней карточки. */
          <div className='absolute inset-x-0 bottom-14 px-4'>
            <p className='font-oswald mb-2 text-[12.5px] uppercase tracking-[1.8px] text-white/80'>
              Джип-туры по Крыму
            </p>
            <h1 className='font-poiret text-[38px] uppercase leading-none tracking-[4px] text-gold-photo'>
              Все туры
            </h1>
          </div>
        }
      />
    }
    mainContent={
      <div className='relative z-3 -mt-8 rounded-t-[32px] bg-page pt-6'>
        <AllTours />
      </div>
    }
    mainBottom={null}
  />
);
