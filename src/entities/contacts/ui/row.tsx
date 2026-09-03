import { cn } from '@bem-react/classname';
import { CSSProperties, FC, PropsWithChildren } from 'react';

import styles from '@/entities/contacts/assets/styles.module.scss';

const cnRow = cn('Row');

type RowProps = PropsWithChildren<{
  color?: string;
  size?: number;
}>;

const DEFAULT_SIZE = 17;

export const Row: FC<RowProps> = ({ children, color, size = DEFAULT_SIZE }) => (
  <div
    className={cnRow(null, [
      'flex',
      'items-center',
      'justify-center',
      'gap-2',
      'tracking-widest',
      'min-h-11',
      styles.Row
    ])}
    style={
      {
        color: color ?? undefined,
        fontSize: `${size}px`
      } satisfies CSSProperties
    }
  >
    {children}
  </div>
);
