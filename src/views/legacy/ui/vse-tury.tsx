'use server';

import { FC, PropsWithChildren } from 'react';

import { AppMain } from '@/widgets/app-main/server';

import { LegacyTourCardData } from '@/shared/model/types';
import { LegacyTourCard } from '@/shared/ui/legacy-tour-card';

import mainPhoto from '../assets/images/ekskursii.jpg';

import { Header } from './header';

export const VseTury: FC<
  PropsWithChildren<{ tours: LegacyTourCardData[] }>
> = async ({ tours, children }) => {
  return (
    <AppMain
      mainHead={<Header title='Все туры' mainPhoto={mainPhoto} />}
      mainContent={
        <div>
          <ul className='flex flex-wrap justify-center items-center'>
            {tours.map((tour, idx) => (
              <li className='py-6 rounded-xl max-w-9/10 grow' key={idx}>
                <LegacyTourCard tour={tour} />
              </li>
            ))}
          </ul>
        </div>
      }
      mainBottom={children}
    />
  );
};
