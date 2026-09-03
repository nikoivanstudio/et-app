'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { RatingLayoutProps } from '@/entities/rating/model/types';
import { RatingLabelLayout } from '@/entities/rating/ui/rating-label-layout';

const cnRatingLabel = cn('RatingLabel');

export const ServerRatingLabel: FC<RatingLayoutProps> = async ({
  rating,
  variant
}) => (
  <RatingLabelLayout
    rating={rating}
    variant={variant}
    className={cnRatingLabel({ type: 'server' })}
  />
);
