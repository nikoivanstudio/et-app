import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { RatingPill } from '@/entities/guide';

import bgFallback from '@/shared/assets/images/backgrounds/bg-1.jpg';
import { cn } from '@/shared/lib/css';

import type { GuideTourCardItem } from '@/kernel/guide/domain';

const formatPrice = (price: number): string =>
  `от ${new Intl.NumberFormat('ru-RU').format(price)} ₽`;

export const GuideTours: FC<{ tours: GuideTourCardItem[] }> = ({ tours }) => (
  <div className='grid grid-cols-2 gap-2.5'>
    {tours.map(tour => (
      <Link
        key={tour.id}
        href={`/tour/${tour.slug}`}
        className='overflow-hidden rounded-2xl border border-[#E2D5B7] bg-white no-underline transition-transform hover:-translate-y-0.5'
      >
        <span className='relative block h-[96px] w-full'>
          <Image
            src={tour.mainPhoto || bgFallback}
            alt={tour.title}
            fill
            sizes='(max-width: 768px) 50vw, 240px'
            className='object-cover'
          />
        </span>
        <span className='block p-2.5'>
          <span className='line-clamp-2 block min-h-[2.4em] text-[12.5px] leading-tight text-[#1F1A12]'>
            {tour.title}
          </span>
          <span className='mt-2 flex items-center justify-between'>
            <span className='text-[13px] font-semibold text-[#8B6F3D]'>
              {formatPrice(tour.price)}
            </span>
            {!!tour.rating && (
              <RatingPill rating={tour.rating} className={cn('px-2 py-0')} />
            )}
          </span>
        </span>
      </Link>
    ))}
  </div>
);
