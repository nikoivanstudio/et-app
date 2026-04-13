import { cn } from '@bem-react/classname';
import { FC, PropsWithChildren } from 'react';

import styles from '@/shared/assets/styles.module.scss';

type TitleProps = {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
};

const cnTitle = cn('Title');

export const Title: FC<PropsWithChildren<TitleProps>> = ({
  children,
  type,
  className
}) => {
  const Tag = type;

  return (
    <Tag
      className={cnTitle({ type }, [
        'text-center',
        'tracking-wider',
        Tag === 'h2' ? 'text-3xl' : 'text-xl',
        styles.Title,
        className
      ])}
    >
      {children}
    </Tag>
  );
};
