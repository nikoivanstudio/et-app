import { Eye } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

import { CabinetIdentity } from '@/features/cabinet/server';

import { cn } from '@/shared/lib/css';
import { cabinetAction } from '@/shared/ui/cabinet';

import { routes } from '@/kernel/routes';

import { CabinetNavItem, CabinetSection } from '../model/nav';

import { CabinetIcon } from './cabinet-icons';

/** Боковое меню кабинета. На телефоне его нет — там нижняя панель. */
export const CabinetRail: FC<{
  identity: CabinetIdentity;
  items: CabinetNavItem[];
  section: CabinetSection;
}> = ({ identity, items, section }) => (
  <aside className='border-cab-line-soft hidden flex-col border-r bg-[#101013] px-4 py-5 lg:flex'>
    <Link href={routes.cabinet.overview(identity.id)} className='flex items-center gap-2.5'>
      <span className='text-cab-on-gold grid size-9 place-items-center rounded-xl bg-linear-140 from-cab-gold to-[#8b6f3d] text-[14px] font-bold'>
        ET
      </span>
      <span>
        <b className='block text-[14px] font-semibold tracking-tight'>
          Energy Tour
        </b>
        <i className='block text-[10.5px] tracking-[0.18em] text-[#8a7a5c] uppercase not-italic'>
          Кабинет гида
        </i>
      </span>
    </Link>

    <nav className='mt-5 flex flex-col gap-1'>
      {items.map(item => {
        const isActive = item.id === section;

        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex min-h-11 items-center gap-3 rounded-[10px] border px-3 text-[13.5px] transition-colors',
              isActive
                ? 'border-cab-gold/32 bg-cab-gold/12 text-cab-ink'
                : 'text-cab-dim hover:bg-cab-raise hover:text-cab-ink border-transparent'
            )}
          >
            <CabinetIcon section={item.id} className='size-4 shrink-0' />
            <span>{item.label}</span>
            {!!item.count && (
              <span
                className={cn(
                  'ml-auto rounded-full px-1.5 text-[11px] font-semibold',
                  item.countTone === 'gold'
                    ? 'bg-cab-gold text-cab-on-gold'
                    : 'bg-cab-line text-cab-dim'
                )}
              >
                {item.count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>

    <div className='border-cab-line mt-auto rounded-2xl border bg-[#151519] p-3'>
      <b className='block text-[13px] font-semibold'>{identity.displayName}</b>
      {!!identity.headline && (
        <p className='text-cab-faint mt-1 line-clamp-2 text-[11.5px]'>
          {identity.headline}
        </p>
      )}
      {identity.isVerified && (
        <p className='text-cab-ok mt-1.5 text-[11.5px]'>Профиль подтверждён</p>
      )}
      <Link
        href={routes.guide(identity.slug)}
        className={cn(cabinetAction({ tone: 'line', size: 'block' }), 'mt-3')}
      >
        <Eye className='size-4' />
        Публичная страница
      </Link>
    </div>
  </aside>
);
