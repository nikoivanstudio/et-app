import { cn as cnBem } from '@bem-react/classname';
import { FC, PropsWithChildren } from 'react';

import styles from '@/entities/rating/assets/styles.module.scss';
import { RatingLayoutProps } from '@/entities/rating/model/types';

import { Star } from '@/shared/ui/star';

const cnRatingLabel = cnBem('RatingLabel');

export const RatingLabelLayout: FC<PropsWithChildren<RatingLayoutProps>> = ({
  rating,
  className,
  variant,
  children
}) => {
  const value = rating?.toFixed(1) || '4.9';

  // В строке факта рейтинг — текст со звёздочкой, без плашки.
  if (variant === 'fact') {
    return (
      <span
        className={cnRatingLabel({ type: 'fact' }, [
          'flex items-baseline gap-1 text-sm opacity-90',
          className,
          styles.RatingLabel__Content
        ])}
      >
        <Star />
        <span>{value}</span>
        {children}
      </span>
    );
  }

  return (
    <div
      className={cnRatingLabel(null, [
        'flex',
        'justify-end',
        'gap-1',
        'mt-4',
        'px-3',
        'py-1',
        'rounded-pill',
        className,
        styles.RatingLabel
      ])}
    >
      <div>
        <Star />
      </div>
      <div className={cnRatingLabel('Content', [styles.RatingLabel__Content])}>
        <span>{value}/5</span>
      </div>
      {children}
    </div>
  );
};
