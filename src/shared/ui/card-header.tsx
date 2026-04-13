import { FC, ReactNode } from 'react';

import { cn } from '@/shared/lib/css';

type CardHeaderProps = {
  leftNode: ReactNode;
  rightNode?: ReactNode;
  className?: string;
};

export const CardHeader: FC<CardHeaderProps> = ({
  leftNode,
  rightNode,
  className
}) => (
  <div
    className={cn('flex', 'justify-between', 'w-full', 'CardHeader', className)}
  >
    {leftNode}
    {rightNode}
  </div>
);
