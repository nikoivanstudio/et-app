import { FC, PropsWithChildren } from 'react';

import { cn } from '@/shared/lib/css';

/** Кремовая плашка с рамкой — прайс, «что входит», часы работы. */
export const DetailBlock: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className
}) => (
  <div
    className={cn(
      'border-rule bg-cream rounded-block overflow-hidden border',
      className
    )}
  >
    {children}
  </div>
);

/** Строка прайса: название слева, цена и единица справа. */
export const PriceRow: FC<{
  name: string;
  price: string;
  unit?: string;
}> = ({ name, price, unit }) => (
  <div className='border-rule flex items-baseline justify-between gap-4 border-b px-4 py-3.5 last:border-b-0'>
    <span className='font-caladea text-ink min-w-0 text-[14.5px]'>{name}</span>
    <span className='shrink-0 text-right'>
      <span className='font-oswald text-ink text-[17px] font-medium whitespace-nowrap'>
        {price}
      </span>
      {!!unit && (
        <span className='font-oswald text-ink-faint ml-1.5 text-[12.5px] whitespace-nowrap'>
          {unit}
        </span>
      )}
    </span>
  </div>
);

/** Строка «что входит» с галочкой. */
export const IncludeRow: FC<{ children: string }> = ({ children }) => (
  <div className='border-rule flex items-start gap-2.5 border-b px-4 py-3 last:border-b-0'>
    <svg
      className='mt-0.5 shrink-0'
      width='17'
      height='17'
      viewBox='0 0 24 24'
      fill='none'
      stroke='var(--free-ink)'
      strokeWidth='2.2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='m4 12.5 5 5L20 6.5' />
    </svg>
    <span className='font-caladea text-ink text-[14.5px] leading-relaxed'>
      {children}
    </span>
  </div>
);
