import { FC, PropsWithChildren } from 'react';

import styles from '@/shared/assets/styles.module.scss';
import { cn } from '@/shared/lib/css';

// Заголовок секции в стиле .et-post .et-h: золотая вертикальная полоска + Poiret.
export const GuideSectionHeading: FC<
  PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <h2
    className={cn(
      styles.poiret_text_black,
      'relative mt-7 mb-3.5 pl-3.5 text-xl text-[#1F1A12]',
      className
    )}
  >
    <span className='absolute left-0 top-[3px] h-[22px] w-1 rounded-[2px] bg-[#B8915A]' />
    {children}
  </h2>
);
