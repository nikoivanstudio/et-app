'use server';

import { FC } from 'react';

import { Skeleton } from '@/shared/ui/skeleton';

/**
 * Скелет загрузки.
 *
 * Было: `bg-zinc-600` во весь экран и два ряда серых плашек — тёмно-серый
 * прямоугольник, к палитре сайта отношения не имеющий, на светлых страницах
 * он читался как сбой. Теперь бумага и кремовые плашки: страница появляется
 * на том же фоне, на котором потом останется.
 */
export const LoadingView: FC = async () => (
  <div className='bg-page min-h-screen'>
    <Skeleton className='rounded-none h-[300px] w-full md:h-[420px]' />
    <div className='bg-page relative z-3 -mt-8 rounded-t-[32px] pt-8'>
      <div className='mx-auto max-w-[1120px] px-4 md:px-6'>
        <Skeleton className='h-9 w-2/3 max-w-[320px]' />
        <div className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[0, 1, 2].map(idx => (
            <Skeleton key={idx} className='rounded-card h-80 w-full' />
          ))}
        </div>
      </div>
    </div>
  </div>
);
