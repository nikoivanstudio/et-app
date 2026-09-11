'use server';

import Link from 'next/link';
import { FC } from 'react';

import { cn } from '@/shared/lib/css';

const pageHref = (page: number) => (page <= 1 ? '/posts' : `/posts/${page}`);

/**
 * Пагинация списка постов.
 * Было: «1 / 2» и две тонкие стрелки-шевроны 36px без фона — тап-таргет
 * меньше нормы, а номера страниц не кликались вовсе.
 */
export const Pagination: FC<{
  totalPages: number;
  currentPage: number;
  total?: number;
  shown?: number;
}> = async ({ totalPages, currentPage, total, shown }) => {
  if (totalPages <= 1) return null;

  const pages = [...Array(totalPages).keys()].map(idx => idx + 1);

  return (
    <div className='bg-page pb-14'>
      <nav
        className='mx-auto flex max-w-[1120px] flex-wrap items-center justify-center gap-2 px-4'
        aria-label='Страницы'
      >
        {currentPage > 1 && (
          <Link className={linkClass(false)} href={pageHref(currentPage - 1)}>
            ← Назад
          </Link>
        )}

        {pages.map(page =>
          page === currentPage ? (
            <span key={page} className={linkClass(true)} aria-current='page'>
              {page}
            </span>
          ) : (
            <Link key={page} className={linkClass(false)} href={pageHref(page)}>
              {page}
            </Link>
          )
        )}

        {currentPage < totalPages && (
          <Link className={linkClass(false)} href={pageHref(currentPage + 1)}>
            Дальше →
          </Link>
        )}
      </nav>

      {!!total && !!shown && (
        <p className='font-oswald text-ink-faint mt-2.5 text-center text-[12px]'>
          Показано {shown} из {total}
        </p>
      )}
    </div>
  );
};

const linkClass = (active: boolean) =>
  cn(
    'font-oswald rounded-pill inline-flex min-h-11 min-w-11 items-center justify-center px-4 text-[14px] transition-colors',
    active
      ? 'bg-cta text-on-cta'
      : 'bg-cream-deep text-ink-muted hover:text-ink border border-rule'
  );
