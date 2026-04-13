import Link from 'next/link';
import { FC } from 'react';

import { firstPage } from '../constants/tours';
import { VseTury } from '../ui/vse-tury';

export const VseTuryFirst: FC = () => (
  <VseTury tours={firstPage}>
    <div className='flex justify-center items-center gap-4 pb-4'>
      <span className='text-zinc-600 text-2xl'>1</span>
      <Link className='text-zinc-600 text-2xl' href='/category/vse_tury/page/2'>
        2
      </Link>
      <Link className='text-zinc-600 text-2xl' href='/category/vse_tury/page/2'>
        Вперед
      </Link>
    </div>
  </VseTury>
);
