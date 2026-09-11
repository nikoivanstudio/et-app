import Image, { ImageProps } from 'next/image';
import { FC } from 'react';

import { SITE_LOGO } from '@/shared/constants/site-constants';

export const LogoIcon: FC<Partial<ImageProps>> = props => (
  <Image
    width={51}
    height={57}
    src={SITE_LOGO.path}
    alt='Логотип Energy-Tour'
    {...props}
  />
);
