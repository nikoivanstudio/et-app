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
  desktopNav?: ReactNode;
  actions?: ReactNode;
  profile?: ReactNode;
  rightNode?: ReactNode;
  isStatic?: boolean;
};

export const Layout: FC<LayoutProps> = ({
  logo,
  nav,
  desktopNav,
  rightNode,
  isStatic
}) => {
  return (
    <header
      className={cnAppHeader(null, [
        !isStatic ? 'absolute top-0 w-full z-10' : ''
      ])}
    >
      <div className='mx-auto flex max-w-[1120px] items-center justify-between px-4 pt-3.5 pb-3.5 md:px-6'>
        {/* Бургер только до md: на десктопе меню разворачивается в строку. */}
        <div className='md:hidden'>
          <Sheet>
            <SheetTrigger
              className={buttonVariants({
                variant: 'ghost',
                size: 'icon',
                className: 'size-11'
              })}
              aria-controls='burgerIcon'
              aria-label='Открыть меню'
            >
              <BurgerIcon className='shrink-0 grow' id='burgerIcon' />
            </SheetTrigger>
            <SheetContent side='left'>
              <SheetHeader className='border-b pb-5 mb-5'>
                <SheetTitle>{logo}</SheetTitle>
              </SheetHeader>
              {nav}
            </SheetContent>
          </Sheet>
        </div>

        <div>{logo}</div>

        {!!desktopNav && (
          <div className='hidden md:block md:grow md:pl-8'>{desktopNav}</div>
        )}

        <div className='flex size-11 items-center justify-center'>
          {rightNode}
        </div>
      </div>
    </header>
  );
};
