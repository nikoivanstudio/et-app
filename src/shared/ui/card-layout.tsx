import Image from 'next/image';
import { FC, ReactNode } from 'react';

import { cn } from '@/shared/lib/css';

import styles from '../assets/styles.module.scss';

type CardLayoutProps = {
  bgImage: string;
  title: string;
  className?: string;
  cardHeader?: ReactNode;
  cardFooter?: ReactNode;
};

export const CardLayout: FC<CardLayoutProps> = ({
  cardHeader,
  cardFooter,
  className,
  title,
  bgImage
}) => (
  <article className={cn('relative', 'h-45', className)}>
    <Image
      className='absolute z-1 w-full h-full rounded-4xl object-cover object-center'
      width={500}
      height={500}
      src={bgImage}
      alt={title}
    />
    <div className={styles.CardMask} />
    <div className='relative flex flex-col justify-between z-3 p-4 mt h-full grow-1'>
      {cardHeader}
      <h3
        className={cn(
          'text-xl',
          'text-left',
          'mt-[8%]',
          'min-h-24',
          'font-normal',

          styles.CardTitle
        )}
      >
        {title}
      </h3>
      {cardFooter}
    </div>
  </article>
);
