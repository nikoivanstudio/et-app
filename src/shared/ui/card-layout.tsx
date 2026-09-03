import Image from 'next/image';
import Link from 'next/link';
import { FC, ReactNode } from 'react';

import { cn } from '@/shared/lib/css';

import styles from '../assets/styles.module.scss';

type CardLayoutProps = {
  href: string;
  bgImage: string;
  title: string;
  className?: string;
  /** Кнопка «в избранное»: лежит поверх ссылки, поэтому кликается отдельно. */
  favourite?: ReactNode;
  /** Строка факта под заголовком: цена · длительность · рейтинг. */
  facts?: ReactNode;
  moreLabel?: string;
};

/**
 * Карточка тура и поста. До v2 поверх фото висело пять плавающих чипов по
 * четырём углам (цена, сердце, рейтинг, длительность и зелёная стрелка),
 * все 22–38px — ниже тап-таргета 44px, а стрелка дублировала переход.
 * Стало: скрим, заголовок и один факт-ряд внизу, тап по всей карточке.
 */
export const CardLayout: FC<CardLayoutProps> = ({
  href,
  bgImage,
  title,
  className,
  favourite,
  facts,
  moreLabel = 'Подробнее'
}) => (
  <article
    className={cn(
      'relative',
      'min-h-[380px]',
      'rounded-card',
      'overflow-hidden',
      className
    )}
  >
    <Image
      className='absolute inset-0 z-1 w-full h-full object-cover object-center'
      width={500}
      height={500}
      src={bgImage}
      alt={title}
    />
    <div className={styles.CardScrim} />

    {/* Ссылка — слой поверх фото: тапается вся карточка, но кнопка избранного
        остаётся отдельной кнопкой, а не вложенной в ссылку. */}
    <Link className='absolute inset-0 z-3' href={href} aria-label={title}>
      <span className='sr-only'>{title}</span>
    </Link>

    {!!favourite && (
      <div className='absolute top-3 right-3 z-4'>{favourite}</div>
    )}

    <div className='absolute inset-x-0 bottom-0 z-4 p-4 pointer-events-none'>
      <h3 className={cn('text-left', 'font-normal', styles.CardTitle)}>
        {title}
      </h3>
      {!!facts && (
        <div className='flex items-baseline gap-2 mt-3 text-white'>
          {facts}
          <span className='ml-auto text-sm text-gold-photo whitespace-nowrap'>
            {moreLabel} →
          </span>
        </div>
      )}
    </div>
  </article>
);
