import { cn } from '@bem-react/classname';
import { FC, ReactNode } from 'react';

import styles from '../assets/styles.module.scss';

const cnSocialItem = cn('SocialItem');

type SocialItemProps = {
  icon: ReactNode;
  href: string;
};

export const SocialItem: FC<SocialItemProps> = ({ icon, href }) => {
  return (
    <div className={cnSocialItem(null, [styles.SocialItem])}>
      <a href={href}>{icon}</a>
    </div>
  );
};
