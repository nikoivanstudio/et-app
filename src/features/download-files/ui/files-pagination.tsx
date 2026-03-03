'use client';

import { FC } from 'react';

import { SimplePagination } from '@/shared/ui/simple-pagination';

type Props = {
  currentPage: number;
  pagesCount: number;
  onPageChange(page: number): void;
};

export const FilesPagination: FC<Props> = ({
  currentPage,
  pagesCount,
  onPageChange
}) => (
  <SimplePagination
    currentCount={currentPage}
    totalCount={pagesCount}
    onPrevClick={() => onPageChange(Math.max(currentPage - 1, 1))}
    onNextClick={() => onPageChange(Math.min(currentPage + 1, pagesCount))}
  />
);
