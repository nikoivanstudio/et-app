import { FC, ReactNode } from 'react';

import { cn } from '@/shared/lib/css';

type CardFooterProps = {
  leftNode: ReactNode;
  rightNode?: ReactNode;
  className?: string;
};

export const CardFooter: FC<CardFooterProps> = ({
  leftNode,
  rightNode,
  className
}) => (
  <div
    className={cn(
      'flex',
      'justify-between',
      'items-end',
      'w-full',
      'mt-auto',
      'CardHeader',
      className
    )}
  >
    {leftNode}
    {rightNode}
  </div>
);
