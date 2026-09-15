import { FC, ReactNode } from 'react';

import { CabinetBadges, CabinetIdentity } from '@/features/cabinet/server';

import { cn } from '@/shared/lib/css';

import { buildCabinetNav, CabinetSection } from '../model/nav';

import { CabinetRail } from './cabinet-rail';
import { CabinetTabbar } from './cabinet-tabbar';

/**
 * Каркас кабинета гида: боковое меню на десктопе, нижняя панель на телефоне
 * и шапка раздела. Внутрь страницы передают только содержимое — заголовок,
 * подзаголовок и кнопки живут здесь, чтобы шесть разделов не разъезжались
 * по отступам.
 */
export const CabinetShell: FC<{
  identity: CabinetIdentity;
  badges: CabinetBadges;
  section: CabinetSection;
  title: string;
  subtitle?: string;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  /** Раздел во всю высоту (переписка): контент сам управляет прокруткой. */
  fullHeight?: boolean;
}> = ({
  identity,
  badges,
  section,
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
  fullHeight
}) => {
  const items = buildCabinetNav(identity.id, badges);

  return (
    <div className='bg-cab-bg text-cab-ink min-h-screen'>
      <div className='grid min-h-screen lg:grid-cols-[264px_minmax(0,1fr)]'>
        <CabinetRail identity={identity} items={items} section={section} />

        <main className='flex min-w-0 flex-col'>
          <header className='border-cab-line-soft flex flex-col gap-4 border-b px-4 py-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8 lg:py-5'>
            <div className='min-w-0'>
              {!!breadcrumbs && (
                <div className='text-cab-mute mb-1.5 flex items-center gap-2 text-[11.5px]'>
                  {breadcrumbs}
                </div>
              )}
              <h1 className='text-[19px] font-semibold tracking-tight sm:text-[21px]'>
                {title}
              </h1>
              {!!subtitle && (
                <p className='text-cab-faint mt-1.5 max-w-[78ch] text-[12.5px] leading-relaxed'>
                  {subtitle}
                </p>
              )}
            </div>
            {!!actions && (
              <div className='flex shrink-0 flex-wrap items-center gap-2'>
                {actions}
              </div>
            )}
          </header>

          <div
            className={cn(
              'flex-1 px-4 pt-5 pb-28 sm:px-6 lg:px-8 lg:pb-8',
              fullHeight && 'flex min-h-0 flex-col'
            )}
          >
            {children}
          </div>
        </main>
      </div>

      <CabinetTabbar items={items} section={section} />
    </div>
  );
};
