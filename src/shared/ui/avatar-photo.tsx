import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';

import styles from '@/shared/assets/styles.module.scss';
import { cn } from '@/shared/lib/css';
import { PropsWithClassNames } from '@/shared/model/types';

type AvatarPhotoProps = {
  alt: string;
  src: string | StaticImageData;
} & PropsWithClassNames;

export const AvatarPhoto: FC<AvatarPhotoProps> = ({ alt, src, className }) => (
  <Image
    className={cn('rounded-full', styles.avatar, className)}
    src={src}
    alt={alt}
    width={33}
    height={33}
  />
);
