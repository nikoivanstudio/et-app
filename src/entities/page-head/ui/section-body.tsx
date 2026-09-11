import { FC, PropsWithChildren } from 'react';

import { cn } from '@/shared/lib/css';

/**
 * Тело раздела под `SectionHead`: бумага наезжает на фото на 32px и закрывает
 * его скруглением сверху — тот же и единственный наезд, что на главной и в
 * каталоге. Ширина контента везде одна: 1120.
 */
export const SectionBody: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className
}) => (
  <div className='bg-page relative z-3 -mt-8 rounded-t-[32px] pt-6 md:pt-10'>
    <div className={cn('mx-auto max-w-[1120px] px-4 md:px-6', className)}>
      {children}
    </div>
  </div>
);
