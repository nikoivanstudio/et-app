import { cn as cnBem } from '@bem-react/classname';
import { FC, PropsWithChildren } from 'react';

import styles from '@/entities/rating/assets/styles.module.scss';
import { RatingLayoutProps } from '@/entities/rating/model/types';

import { Star } from '@/shared/ui/star';

const cnRatingLabel = cnBem('RatingLabel');

export const RatingLabelLayout: FC<PropsWithChildren<RatingLayoutProps>> = ({
  rating,
  className,
  children
}) => (
  <div
    className={cnRatingLabel(null, [
      'flex',
      'justify-end',
      'gap-1',
      'mt-4',
      'px-3',
      'py-1',
      'rounded-full',
      className,
      styles.RatingLabel
    ])}
  >
    <div>
      <Star />
    </div>
    <div className={cnRatingLabel('Content', [styles.RatingLabel__Content])}>
      <span>{rating?.toFixed(1) || '4.9'}/5</span>
    </div>
    {children}
  </div>
);
