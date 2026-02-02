'use client';

import { FC } from 'react';

import { cn } from '@/shared/lib/css';

const items = [
  {
    title: 'Заказ внедорожников',
    price: 'от 2000',
    descr: '₽ в час'
  },
  {
    title: 'Джип туры',
    price: 'от 5000',
    descr: '₽ за тур'
  },
  {
    title: 'Экспедиционные джип туры',
    price: 'от 20000',
    descr: '₽ в день'
  }
];

export const PriceBanner: FC = () => (
  <div className='w-full flex justify-center mt-3'>
    <div className='gap-1 max-w-4xl w-full px-3 py-2 shadow-md border rounded-lg text-center bg-white/1 backdrop-blur-sm'>
      {items.map((item, idx) => (
        <div
          className='flex justify-between items-center justify-between mt-5 basis-1/2'
          key={idx}
        >
          <div
            className={cn('text-[17px] min-h-10 max-w-1/2 font-sans text-left')}
          >
            {item.title}
          </div>
          <div className='flex items-center gap-3 basis-1/2'>
            <p className='block text-[17px] text-orange-500 font-sans'>
              {item.price}
            </p>
            <p className='block text-[17px] text-gray-700 font-thin font-sans text-nowrap ml-auto'>
              {item.descr}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
