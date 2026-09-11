import { FC } from 'react';

import { getCurrentYear } from '@/shared/lib/seo/current-year';

/** Год в копирайте был литералом `{2026}` прямо в JSX. */
export const Rights: FC = () => (
  <div className='Rights font-oswald flex items-center justify-center gap-5 text-[13px] tracking-widest text-white/70 mt-10'>
    © {getCurrentYear()} Energy-Tour
  </div>
);
