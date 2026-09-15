import Link from 'next/link';
import { FC } from 'react';

import { cn } from '@/shared/lib/css';

import { CabinetNavItem, CabinetSection } from '../model/nav';

import { CabinetIcon } from './cabinet-icons';

/**
 * Нижняя панель на телефоне.
 *
 * Гид смотрит заявки между выездами, поэтому на узком экране разделы
 * переезжают вниз под большой палец, а боковое меню не показывается вовсе.
 */
export const CabinetTabbar: FC<{
  items: CabinetNavItem[];
  section: CabinetSection;
}> = ({ items, section }) => (
  <nav className='border-cab-line-soft fixed inset-x-0 bottom-0 z-40 flex border-t bg-[#101013] px-1 pt-2 pb-[max(env(safe-area-inset-bottom),0.75rem)] lg:hidden'>
    {items.map(item => (
      <Link
        key={item.id}
        href={item.href}
        aria-current={item.id === section ? 'page' : undefined}
        className={cn(
          'relative flex flex-1 flex-col items-center gap-1 py-1 text-[10.5px]',
          item.id === section ? 'text-cab-gold' : 'text-cab-mute'
        )}
      >
        <CabinetIcon section={item.id} className='size-5' />
        <span>{item.shortLabel}</span>
        {!!item.count && item.countTone === 'gold' && (
          <span className='bg-cab-gold text-cab-on-gold absolute top-0 right-[22%] rounded-full px-1.5 text-[9.5px] font-bold'>
            {item.count}
          </span>
        )}
      </Link>
    ))}
  </nav>
);
