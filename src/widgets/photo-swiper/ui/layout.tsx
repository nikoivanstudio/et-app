import { FC } from 'react';

import { LayoutProps } from '@/widgets/photo-swiper/domain';
import { PhotoList } from '@/widgets/photo-swiper/ui/photo-list';

import styles from '@/shared/assets/styles.module.scss';
import { cn } from '@/shared/lib/css';

export const PhotoSwiperLayout: FC<LayoutProps> = ({ photos }) => (
  <div className={cn('p-3', 'w-full')}>
    <PhotoList photos={photos} />
    <div className='text-right mt-1.5 px-4'>
      <span
        className={cn(styles.oswald_text, 'text-[#41503F]', 'tracking-wider')}
      >
        Смотреть все фото
      </span>
    </div>
  </div>
);
