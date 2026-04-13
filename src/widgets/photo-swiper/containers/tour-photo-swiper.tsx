'use server';

import { FC } from 'react';

import { LayoutProps } from '@/widgets/photo-swiper/domain';
import { PhotoSwiperLayout } from '@/widgets/photo-swiper/ui/layout';

export const TourPhotoSwiper: FC<LayoutProps> = async ({ photos }) => (
  <PhotoSwiperLayout photos={photos} />
);
