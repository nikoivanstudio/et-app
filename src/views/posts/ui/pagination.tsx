'use server';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

import { cn } from '@/shared/lib/css';

export const Pagination: FC<{
  totalPages: number;
  currentPage: number;
}> = async ({ totalPages, currentPage }) => {
  return (
    <>
      {totalPages > 1 && (
        <div
          className={cn(
            'w-full',
            'flex',
            'justify-center',
            'items-center',
            'text-zinc-700',
            'text-2xl'
          )}
        >
          {currentPage > 1 && (
            <Link href={`/posts/${currentPage - 1}`}>
              <ChevronLeft size={36} />
            </Link>
          )}
          <div className='my-auto text-lg'>
            {currentPage} / {totalPages}
          </div>
          {currentPage < totalPages && (
            <Link href={`/posts/${currentPage + 1}`}>
              <ChevronRight size={36} />
            </Link>
          )}
        </div>
      )}
    </>
  );
};
