'use client';

import { FC, ReactNode, useState } from 'react';

import { cn } from '@/shared/lib/css';

import {
  DURATION_BUCKETS,
  DurationBucketId
} from '@/views/legacy/lib/duration';

type Item = {
  bucket: DurationBucketId | null;
  card: ReactNode;
};

type Props = {
  items: Item[];
  total: number;
};

/**
 * Фильтр каталога по длительности. Карточки приходят уже отрендеренными с
 * сервера — здесь только выбор корзины и сетка. Фильтра на этой странице
 * раньше не было, хотя длительность в данных есть.
 */
export const ToursFilterGrid: FC<Props> = ({ items, total }) => {
  const [active, setActive] = useState<DurationBucketId>('all');

  const visible =
    active === 'all' ? items : items.filter(item => item.bucket === active);

  return (
    <>
      <div className='-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0'>
        {DURATION_BUCKETS.map(({ id, label }) => (
          <button
            key={id}
            type='button'
            onClick={() => setActive(id)}
            className={cn(
              'font-oswald inline-flex h-11 shrink-0 items-center rounded-pill px-4.5 text-[13.5px] whitespace-nowrap transition-colors',
              id === active
                ? 'bg-cta text-on-cta'
                : 'bg-cream-deep text-ink-muted hover:text-ink'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className='font-oswald text-ink-faint mt-5 flex items-baseline justify-between text-[13px]'>
        <span>
          Показано {visible.length} из {total}
        </span>
      </div>

      <ul className='mt-4 flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3'>
        {visible.map((item, idx) => (
          <li key={idx}>{item.card}</li>
        ))}
      </ul>

      {!visible.length && (
        <p className='font-caladea text-ink-muted py-10 text-center text-sm'>
          В этой длительности туров нет — посмотрите остальные.
        </p>
      )}
    </>
  );
};
