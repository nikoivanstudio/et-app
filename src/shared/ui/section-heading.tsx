import { FC, PropsWithChildren } from 'react';

import styles from '@/shared/assets/styles.module.scss';
import { cn } from '@/shared/lib/css';

/**
 * Заголовок блока: золотая полоска + Poiret — то же, что `.et-post .et-h`.
 * Один заголовок на всё приложение вместо трёх копий (гид, пост, услуга).
 */
export const SectionHeading: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className
}) => (
  <h2
    className={cn(
      styles.poiret_text_black,
      'text-ink relative mt-7 mb-3.5 pl-3.5 text-xl',
      className
    )}
  >
    <span className='bg-gold-plate absolute top-[3px] left-0 h-[22px] w-1 rounded-[2px]' />
    {children}
  </h2>
);
