import Image, { ImageProps } from 'next/image';
import { FC } from 'react';

import imgUrl from '../assets/images/logo.png';

export const LogoIcon: FC<Partial<ImageProps>> = props => (
  <Image
    width={51}
    height={57}
    src={imgUrl}
    alt='Логотип Energy-Tour'
    {...props}
  />
);
