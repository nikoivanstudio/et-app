import { FC } from 'react';

import { cn } from '@/shared/lib/css';

/**
 * Скелет карточки кабинета. Повторяет раскладку заявки, чтобы список
 * не прыгал, когда данные доехали.
 */
export const CabinetSkeleton: FC<{ rows?: number; className?: string }> = ({
  rows = 3,
  className
}) => (
  <div className={cn('flex flex-col gap-3', className)} aria-hidden>
    {[...Array(rows).keys()].map(index => (
      <div
        key={index}
        className='border-cab-line bg-cab-panel flex flex-col gap-2.5 rounded-2xl border p-4'
      >
        <span className='bg-cab-line h-3 w-2/5 animate-pulse rounded-full' />
        <span className='bg-cab-line h-3 w-3/4 animate-pulse rounded-full' />
        <span className='bg-cab-line h-3 w-1/2 animate-pulse rounded-full' />
      </div>
    ))}
  </div>
);
