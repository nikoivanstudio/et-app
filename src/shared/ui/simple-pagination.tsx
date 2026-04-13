import { cn } from '@bem-react/classname';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/shared/ui/button';

type Props = {
  currentCount: number;
  totalCount: number;
  onPrevClick?: () => void;
  onNextClick?: () => void;
};

const cnSimplePagination = cn('SimplePagination');

export const SimplePagination: FC<Props> = ({
  currentCount,
  totalCount,
  onPrevClick,
  onNextClick
}) => (
  <div
    className={cnSimplePagination('Pagination', [
      'flex',
      'justify-center',
      'gap-3'
    ])}
  >
    <Button variant='ghost' onClick={onPrevClick}>
      <ChevronLeft />
    </Button>
    <div className='my-auto text-lg'>
      {currentCount} / {totalCount}
    </div>
    <Button variant='ghost' onClick={onNextClick}>
      <ChevronRight />
    </Button>
  </div>
);
