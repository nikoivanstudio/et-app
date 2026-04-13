'use server';

import { FC } from 'react';

import { TourCardEntity } from '@/features/tour';
import { ServerTourCard } from '@/features/tour/server';

import { PropsWithClassNames } from '@/shared/model/types';

type Props = { tours: TourCardEntity[] } & PropsWithClassNames;

export const ServerTourCardList: FC<Props> = async ({ tours, className }) => (
  <ul className={className}>
    {tours.map(tour => (
      <li key={tour.id}>
        <ServerTourCard {...tour} />
      </li>
    ))}
  </ul>
);
