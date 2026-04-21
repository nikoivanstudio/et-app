import { cn } from '@bem-react/classname';
import { FC, ReactNode } from 'react';

import { BurgerIcon } from '@/shared/ui/burger-icon';
import { buttonVariants } from '@/shared/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/shared/ui/sheet';

const cnAppHeader = cn('AppHeader');

type LayoutProps = {
  logo?: ReactNode;
  nav?: ReactNode;
  actions?: ReactNode;
  profile?: ReactNode;
  rightNode?: ReactNode;
  isStatic?: boolean;
};

export const Layout: FC<LayoutProps> = ({
  logo,
  nav,
  rightNode,
  isStatic
}) => {
  return (
    <header
      className={cnAppHeader(null, [
        !isStatic ? 'absolute top-0 w-full z-10' : ''
      ])}
    >
      <div className='flex justify-between items-center px-5 pt-4 pb-12'>
        <div>
          <Sheet>
            <SheetTrigger
              className={buttonVariants({ variant: 'ghost' })}
              aria-controls='burgerIcon'
            >
              <BurgerIcon
                className='shrink-0 grow md:w-40 md:h-40'
                id='burgerIcon'
              />
            </SheetTrigger>
            <SheetContent side='left'>
              <SheetHeader className='border-b pb-5 mb-5'>
                <SheetTitle>{logo}</SheetTitle>
              </SheetHeader>
              {nav}
            </SheetContent>
          </Sheet>
        </div>
        <div className='mr-4'>{logo}</div>
        <div>{rightNode}</div>
      </div>
    </header>
  );
};
