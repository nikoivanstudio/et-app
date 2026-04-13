'use server';

import '../assets/styles.scss';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

const cnPageTitle = cn('PageTitle');

enum TitleTypes {
  BRAND = 'brand',
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

type TitleData = {
  text: string;
  type?: TitleTypes;
  className?: string;
};

type PageTitleProps = {
  title?: TitleData;
  topTitle?: TitleData;
  middleTitle?: TitleData;
  bottomTitle?: TitleData;
};

export const PageTitle: FC<PageTitleProps> = async ({
  title,
  topTitle,
  middleTitle,
  bottomTitle
}) => (
  <h1 className={cnPageTitle({ type: title?.type }, [title?.className])}>
    {title?.text}
    {!!topTitle && (
      <span
        className={cnPageTitle('TopTitle', { type: topTitle.type || 'brand' }, [
          'block uppercase',
          topTitle.className
        ])}
      >
        {topTitle.text}
      </span>
    )}
    {!!middleTitle && (
      <span
        className={cnPageTitle(
          'MiddleTitle',
          { type: middleTitle.type || 'light' },
          ['block', middleTitle.className, 'mt-7']
        )}
      >
        {middleTitle.text}
      </span>
    )}
    {!!bottomTitle && (
      <span
        className={cnPageTitle(
          'BottomTitle',
          { type: bottomTitle.type || 'dark' },
          ['block', bottomTitle.className]
        )}
      >
        {bottomTitle.text}
      </span>
    )}
  </h1>
);
