import { FC } from 'react';

import { GuideAvatar } from '@/entities/guide';

import { cn } from '@/shared/lib/css';

import type { GuideReviewItem } from '@/kernel/guide/domain';

const ESTIMATION_ROWS: {
  key: keyof GuideReviewItem['estimation'];
  label: string;
}[] = [
  { key: 'guideWork', label: 'Работа гида' },
  { key: 'informationQuality', label: 'Информация' },
  { key: 'trailQuality', label: 'Маршрут' }
];

const MAX_SCORE = 5;

const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('ru-RU', {
    month: 'short',
    year: 'numeric'
  }).format(new Date(iso));

const EstimationBar: FC<{ label: string; value: number }> = ({
  label,
  value
}) => {
  const pct = Math.max(0, Math.min(100, (value / MAX_SCORE) * 100));

  return (
    <div className='flex items-center gap-2'>
      <span className='w-[88px] shrink-0 text-[11px] text-[#6B5F47]'>
        {label}
      </span>
      <span className='h-[5px] flex-1 overflow-hidden rounded-full bg-[#E7DCC4]'>
        <span
          className='block h-full rounded-full bg-[#B8915A]'
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className='w-6 shrink-0 text-right text-[11px] text-[#8B6F3D]'>
        {value.toFixed(1)}
      </span>
    </div>
  );
};

export const GuideReviews: FC<{ reviews: GuideReviewItem[] }> = ({
  reviews
}) => (
  <div className='flex flex-col gap-2.5'>
    {reviews.map(review => (
      <article
        key={review.id}
        className='rounded-2xl border border-[#E2D5B7] bg-[#FBF7EE] p-3.5'
      >
        <header className='mb-2.5 flex items-center gap-2.5'>
          <GuideAvatar
            src={review.authorAvatar}
            name={review.authorName}
            size={30}
            ring={0}
          />
          <span className='text-[13px] text-[#1F1A12]'>
            {review.authorName}
          </span>
          <span className='ml-auto text-[11px] text-[#6B5F47]'>
            {formatDate(review.createdAt)}
          </span>
        </header>

        {!!review.content && (
          <p className={cn('mb-3 text-[13.5px] leading-relaxed text-[#1F1A12]')}>
            {review.content}
          </p>
        )}

        <div className='grid gap-1.5'>
          {ESTIMATION_ROWS.map(row => (
            <EstimationBar
              key={row.key}
              label={row.label}
              value={review.estimation[row.key] ?? 0}
            />
          ))}
        </div>
      </article>
    ))}
  </div>
);
