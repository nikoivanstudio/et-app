'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { PhotoEntity } from '@/widgets/photo-swiper/domain';
import { Photo } from '@/widgets/photo-swiper/ui/photo';

import { PropsWithClassNames } from '@/shared/model/types';

type PhotoListProps = {
  photos: PhotoEntity[];
} & PropsWithClassNames;

const cnPhotoList = cn('PhotoList');

export const PhotoList: FC<PhotoListProps> = async ({ photos }) => (
  <ul className={cnPhotoList(null, ['flex', 'items-center', 'w-full'])}>
    {photos.slice(0, 3).map(({ title, source }, idx) => (
      <li
        className={cnPhotoList('Item', [
          'relative',
          'w-full',
          `z-${idx + 1}`,
          idx > 0 ? 'ml-[-8px]' : ''
        ])}
        key={idx}
      >
        <Photo title={title} source={source} />
      </li>
    ))}
  </ul>
);
