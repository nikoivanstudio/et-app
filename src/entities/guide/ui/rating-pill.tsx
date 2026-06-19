import { FC } from 'react';

import { cn } from '@/shared/lib/css';
import { PropsWithClassNames } from '@/shared/model/types';
import { BlackStar } from '@/shared/ui/black-star';

type Props = {
  rating: number;
  /** Показывать «/5» после числа. */
  withMax?: boolean;
} & PropsWithClassNames;

// Пилюля-рейтинг в стиле MockReviewsAvatars: белый фон, чёрная звезда.
export const RatingPill: FC<Props> = ({ rating, withMax = false, className }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full border border-[#E2D5B7] bg-white px-2.5 py-0.5',
      className
    )}
  >
    <BlackStar width={13} height={13} />
    <span className='text-sm text-[#1F1A12]'>
      {rating ? rating.toFixed(1) : '—'}
      {withMax && '/5'}
    </span>
  </span>
);
