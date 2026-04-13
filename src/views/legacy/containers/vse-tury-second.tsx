import Link from 'next/link';
import { FC } from 'react';

import { secondPage } from '@/views/legacy/constants/tours';
import { VseTury } from '@/views/legacy/ui/vse-tury';

export const VseTurySecond: FC = () => (
  <VseTury tours={secondPage}>
    <div className='flex justify-center items-center gap-4 pb-4'>
      <Link className='text-zinc-600 text-2xl' href='/category/vse_tury'>
        Назад
      </Link>
      <Link className='text-zinc-600 text-2xl' href='/category/vse_tury'>
        1
      </Link>
      <span className='text-zinc-600 text-2xl'>2</span>
    </div>
  </VseTury>
);
