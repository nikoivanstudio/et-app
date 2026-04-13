'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { RatingLayoutProps } from '@/entities/rating/model/types';
import { RatingLabelLayout } from '@/entities/rating/ui/rating-label-layout';

const cnRatingLabel = cn('RatingLabel');

export const ServerRatingLabel: FC<RatingLayoutProps> = async ({ rating }) => (
  <RatingLabelLayout
    rating={rating}
    className={cnRatingLabel({ type: 'server' })}
  />
);
