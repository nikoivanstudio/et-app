import { FC } from 'react';

import { firstPage, secondPage } from '@/views/legacy/constants/tours';
import { Pagination } from '@/views/legacy/ui/pagination';
import { VseTury } from '@/views/legacy/ui/vse-tury';

export const VseTurySecond: FC = () => (
  <VseTury tours={secondPage} totalCount={firstPage.length + secondPage.length}>
    <Pagination current={2} />
  </VseTury>
);
