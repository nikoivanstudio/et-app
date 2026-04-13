'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { Skeleton } from '@/shared/ui/skeleton';

const cnLoadingView = cn('LoadingView');

export const LoadingView: FC = async () => (
  <div
    className={cnLoadingView(null, [
      'w-screen',
      'h-screen',
      'flex',
      'flex-col',
      'items-center',
      'gap-15',
      'bg-zinc-600',
      'p-25'
    ])}
  >
    <div className='flex items-center space-x-4'>
      <Skeleton className='h-12 w-12 rounded-full' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[250px]' />
        <Skeleton className='h-4 w-[200px]' />
      </div>
    </div>
    <div className='flex items-center space-x-4'>
      <Skeleton className='h-12 w-12 rounded-full' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[250px]' />
        <Skeleton className='h-4 w-[200px]' />
      </div>
    </div>
  </div>
);
