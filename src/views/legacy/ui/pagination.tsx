import Link from 'next/link';
import { FC } from 'react';

import { cn } from '@/shared/lib/css';

const FIRST = '/category/vse_tury';
const SECOND = '/category/vse_tury/page/2';

const pageCls =
  'font-oswald inline-flex h-11 min-w-11 items-center justify-center rounded-pill border border-rule px-4 text-[15px] text-ink-muted transition-colors hover:text-ink';
const activeCls = 'bg-cta border-cta text-on-cta font-semibold';

/** Было «1 2 Вперед» текстом zinc-600 без тап-таргета. */
export const Pagination: FC<{ current: 1 | 2 }> = ({ current }) => (
  <div className='flex items-center justify-center gap-2 pt-8'>
    {current === 2 && (
      <Link className={pageCls} href={FIRST}>
        ← Назад
      </Link>
    )}
    <Link className={cn(pageCls, current === 1 && activeCls)} href={FIRST}>
      1
    </Link>
    <Link className={cn(pageCls, current === 2 && activeCls)} href={SECOND}>
      2
    </Link>
    {current === 1 && (
      <Link className={cn(pageCls, 'px-5')} href={SECOND}>
        Вперёд →
      </Link>
    )}
  </div>
);
