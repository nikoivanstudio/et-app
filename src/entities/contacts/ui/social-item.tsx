import { cn } from '@bem-react/classname';
import { CSSProperties, FC, ReactNode } from 'react';

import styles from '@/entities/contacts/assets/styles.module.scss';

const cnSocialItem = cn('SocialItem');

type SocialItemProps = {
  icon: ReactNode;
  href: string;
  color?: string;
  size?: number;
};

const DEFAULT_SIZE = 50;

export const SocialItem: FC<SocialItemProps> = ({
  icon,
  href,
  color,
  size = DEFAULT_SIZE
}) => (
  <div
    className={cnSocialItem(null, [styles.SocialItem])}
    style={
      {
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color ?? undefined
      } satisfies CSSProperties
    }
  >
    <a href={href}>{icon}</a>
  </div>
);
