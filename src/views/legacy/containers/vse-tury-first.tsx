import { FC } from 'react';

import { firstPage, secondPage } from '../constants/tours';
import { Pagination } from '../ui/pagination';
import { VseTury } from '../ui/vse-tury';

export const VseTuryFirst: FC = () => (
  <VseTury tours={firstPage} totalCount={firstPage.length + secondPage.length}>
    <Pagination current={1} />
  </VseTury>
);
