'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { TourCardEntity } from '@/features/tour';

import { ServerDurationLabel } from '@/entities/duration/server';
import { FavouriteLabel } from '@/entities/favourite';
import { ServerRatingLabel } from '@/entities/rating/server';

import { ArrowLinkIcon } from '@/shared/ui/arrow-link-icon';
import { BadgePrice } from '@/shared/ui/badge-price';
import { CardFooter } from '@/shared/ui/card-footer';
import { CardHeader } from '@/shared/ui/card-header';
import { CardLayout } from '@/shared/ui/card-layout';

import { LinkButton } from './link-button';

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
    className={cnTourCard({ type: 'server' }, ['min-h-[420px]'])}
    bgImage={mainPhoto}
    title={title}
    cardHeader={
      <CardHeader
        leftNode={
          <div>
            <BadgePrice className={cnTourCard('Price')} price={price} />
          </div>
        }
        rightNode={
          <div className='flex flex-col items-end'>
            <FavouriteLabel id={id} />
            <ServerRatingLabel rating={rating} />
          </div>
        }
      />
    }
    cardFooter={
      <CardFooter
        leftNode={
          <>{!!duration && <ServerDurationLabel duration={duration} />}</>
        }
        rightNode={
          <LinkButton href={`/tour/${slug}`}>
            <ArrowLinkIcon />
          </LinkButton>
        }
      />
    }
  />
);
