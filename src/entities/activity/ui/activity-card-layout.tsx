'use server';

import { cn as cnBem } from '@bem-react/classname';
import Link from 'next/link';
import { FC, ReactNode } from 'react';

const cnActivityCard = cnBem('ActivityCard');

type LayoutProps = {
  id: number;
  leftNode: ReactNode;
  titleNode: ReactNode;
  descriptionNode: ReactNode;
  className?: string;
};

export const ActivityCardLayout: FC<LayoutProps> = async ({
  id,
  leftNode,
  titleNode,
  descriptionNode,
  className
}) => (
  <Link
    className={cnActivityCard(null, [
      'flex',
      'items-center',
      'justify-between',
      'gap-4.5',
      'backdrop-blur-xs',
      'px-3.5',
      'py-1.5',
      'mt-4',
      'rounded-xl',
      className
    ])}
    href={`activities?id=${id}`}
  >
    <div className={cnActivityCard('LeftWrap')}>{leftNode}</div>
    <div className={cnActivityCard('RightWrap')}>
      <div>{titleNode}</div>
      <div>{descriptionNode}</div>
    </div>
  </Link>
);
