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
      'gap-3',
      'px-3.5',
      'py-3',
      'rounded-xl',
      'text-white',
      className
    ])}
    href={`activities?id=${id}`}
  >
    <div className={cnActivityCard('LeftWrap')}>{leftNode}</div>
    {/* Название сжимается и переносится, цена и статус — нет. */}
    <div className={cnActivityCard('RightWrap', ['min-w-0 flex-1'])}>
      {titleNode}
    </div>
    <div className={cnActivityCard('Meta')}>{descriptionNode}</div>
  </Link>
);
