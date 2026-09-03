'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { TourCardEntity } from '@/features/tour';

import { ServerDurationLabel } from '@/entities/duration/server';
import { FavouriteLabel } from '@/entities/favourite';
import { ServerRatingLabel } from '@/entities/rating/server';

import { BadgePrice } from '@/shared/ui/badge-price';
import { CardLayout } from '@/shared/ui/card-layout';

const cnTourCard = cn('TourCard');

export const ServerTourCard: FC<TourCardEntity> = async ({
  id,
  price,
  mainPhoto,
  title,
  rating,
  duration,
  slug
}) => (
  <CardLayout
    className={cnTourCard({ type: 'server' })}
    href={`/tour/${slug}`}
    bgImage={mainPhoto}
    title={title}
    favourite={<FavouriteLabel id={id} />}
    facts={
      <>
        <BadgePrice
          className={cnTourCard('Price')}
          price={price}
          variant='fact'
        />
        {!!duration && (
          <>
            <span className='opacity-50'>·</span>
            <ServerDurationLabel duration={duration} variant='fact' />
          </>
        )}
        <span className='opacity-50'>·</span>
        <ServerRatingLabel rating={rating} variant='fact' />
      </>
    }
  />
);
