import Link from 'next/link';
import { FC } from 'react';

import { reviewsLabel } from '@/entities/guide/lib/plural';
import { GuideAvatar } from '@/entities/guide/ui/guide-avatar';
import { RatingPill } from '@/entities/guide/ui/rating-pill';

import { cn } from '@/shared/lib/css';

import type { GuideSummary } from '@/kernel/guide/domain';

type Props = {
  guide: GuideSummary;
  className?: string;
};

// Карточка гида на странице тура. Вся карточка — ссылка на профиль гида.
export const GuideCard: FC<Props> = ({ guide, className }) => (
  <Link
    href={`/guide/${guide.slug}`}
    aria-label={`Гид ${guide.displayName}, рейтинг ${guide.rating}, ${reviewsLabel(
      guide.reviewsCount
    )} — открыть профиль`}
    className={cn(
      'flex items-center gap-3.5 rounded-[18px] border border-[#E2D5B7] bg-[#FBF7EE] p-3.5 no-underline transition-transform hover:-translate-y-0.5',
      className
    )}
  >
    <GuideAvatar
      src={guide.avatarPhoto}
      name={guide.displayName}
      size={58}
      verified={guide.isVerified}
    />

    <span className='min-w-0 flex-1'>
      <span className='block text-[10px] font-medium uppercase tracking-[0.18em] text-[#8B6F3D]'>
        Ваш гид
      </span>
      <span className='mt-0.5 block truncate text-lg leading-tight text-[#1F1A12]'>
        {guide.displayName}
      </span>
      <span className='mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1'>
        <RatingPill rating={guide.rating} className='px-2 py-0.5' />
        {!!guide.reviewsCount && (
          <>
            <span className='text-[#E2D5B7]'>·</span>
            <span className='text-xs text-[#6B5F47]'>
              {reviewsLabel(guide.reviewsCount)}
            </span>
          </>
        )}
        {!!guide.headline && (
          <>
            <span className='text-[#E2D5B7]'>·</span>
            <span className='truncate text-xs text-[#6B5F47]'>
              {guide.headline}
            </span>
          </>
        )}
      </span>
    </span>

    <span className='shrink-0 pl-1 text-2xl leading-none text-[#B8915A]'>›</span>
  </Link>
);
