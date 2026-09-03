import { cn } from '@bem-react/classname';
import { FC, PropsWithChildren } from 'react';

import styles from '@/shared/assets/styles.module.scss';

type TitleProps = {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  /** Заголовок лежит поверх фото — светлое золото по скриму вместо тёмного. */
  onPhoto?: boolean;
};

const cnTitle = cn('Title');

export const Title: FC<PropsWithChildren<TitleProps>> = ({
  children,
  type,
  className,
  onPhoto
}) => {
  const Tag = type;

  return (
    <Tag
      className={cnTitle({ type }, [
        'text-center',
        'tracking-wider',
        Tag === 'h2' ? 'text-[26px]' : 'text-xl',
        styles.Title,
        onPhoto ? styles.Title_onPhoto : '',
        className
      ])}
    >
      {children}
    </Tag>
  );
};
