'use server';

import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { LegacyTourCardData } from '@/shared/model/types';

export const LegacyTourCard: FC<{ tour: LegacyTourCardData }> = async ({
  tour
}) => (
  <Link
    className='bg-white shadow-md rounded-md grow h-full min-h-[70vh] h-full'
    href={tour.href}
  >
    <div className='relative h-3\5 w-full'>
      <Image
        width={500}
        height={500}
        src={tour.img}
        alt={tour.title}
        className='object-cover h-[50vh] w-full grow'
      />
      <div className='absolute bottom-0 left-0 w-full bg-black/30 text-white p-2 text-lg text-center'>
        {tour.title}
      </div>
    </div>
    <div className='p-3 text-center bg-zinc-500 text-white mt-[-1px] h-2\5'>
      <p className='text-lg'>
        Продолжительность: <b>{tour.duration}</b>
      </p>
      <p className='text-md'>
        Стоимость: <b>{tour.price}</b>
      </p>
      <span className='mt-4 border border-white px-4 py-1 text-lg font-bold rounded block w-3/4 mx-auto'>
        ПОДРОБНЕЕ
      </span>
    </div>
  </Link>
);
