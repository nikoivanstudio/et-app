'use server';

import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { cn } from '@/shared/lib/css';
import { LegacyTourCardData } from '@/shared/model/types';

import styles from '../assets/styles.module.scss';

/**
 * Карточка тура для страниц старого сайта: каталог, слайдер, услуги.
 * До v2 это была белая плашка с фото на 50vh и серым блоком zinc-500 под ним
 * («Продолжительность: … / Стоимость: …» и «ПОДРОБНЕЕ» в рамке) — вёрстка
 * старого сайта. Теперь та же карточка, что в каталоге из базы: скрим,
 * заголовок и один факт-ряд «цена · длительность».
 */
export const LegacyTourCard: FC<{ tour: LegacyTourCardData }> = async ({
  tour
}) => (
  /* `w-full` обязателен: в гриде и в слайдере у карточки нет собственной
     ширины — всё внутри absolute, и без него она схлопывалась в 0×320.
     Из-за этого /uslugi выглядела пустой страницей. */
  <Link
    className='rounded-card relative block h-80 w-full overflow-hidden'
    href={tour.href}
  >
    {tour.img ? (
      <Image
        className='absolute inset-0 z-1 h-full w-full object-cover object-center'
        width={500}
        height={500}
        src={tour.img}
        alt={tour.title}
      />
    ) : (
      /* Фото для услуги ещё нет — плашка на туши с маркой вместо чужого
         кадра и вместо битой картинки. */
      <div className='bg-ink absolute inset-0 z-1 flex items-center justify-center'>
        <span className='font-poiret text-gold-photo/35 text-[64px] leading-none'>
          ET
        </span>
      </div>
    )}
    <div className={styles.CardScrim} />
    <div className='absolute inset-x-0 bottom-0 z-3 p-4'>
      {/* Названия здесь длинные, до 60 символов — обрезаем по трём строкам,
          чтобы карточки в сетке оставались одной высоты. */}
      <h3
        className={cn(
          'line-clamp-3 text-left text-[24px] font-normal',
          styles.CardTitle
        )}
      >
        {tour.title}
      </h3>
      <div className='font-oswald mt-3 flex items-baseline gap-2 text-white'>
        {/* Длинные подписи вроде «от 2 000 ₽/экскурсия · от 1 экскурсии»
            выдавливали «Подробнее» за край карточки — факты сжимаются, а
            ссылка остаётся на месте. */}
        <span className='flex min-w-0 items-baseline gap-2 overflow-hidden'>
          <span className='text-[21px] font-medium whitespace-nowrap'>
            {tour.price}
          </span>
          {!!tour.duration && (
            <>
              <span className='opacity-50'>·</span>
              <span className='truncate text-sm opacity-90'>
                {tour.duration}
              </span>
            </>
          )}
        </span>
        <span className='text-gold-photo ml-auto shrink-0 pl-2 text-[13px] whitespace-nowrap'>
          Подробнее →
        </span>
      </div>
    </div>
  </Link>
);
