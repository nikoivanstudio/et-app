import { cn } from '@bem-react/classname';
import Link from 'next/link';
import { FC } from 'react';

import { NAV_LINKS } from '@/widgets/app-header/model/links';
import { AuthNavLink } from '@/widgets/app-header/ui/auth-nav-link';
import { MyBookingsNavLink } from '@/widgets/app-header/ui/my-bookings-nav-link';

import { RegionSwitcher } from '@/features/region/region-switcher';

import { getPublishedRegions } from '@/entities/region/server';

const cnMainNav = cn('MainNav');

const linkClassName = cnMainNav('Link', [
  'flex min-h-11 items-center px-4 text-base',
  'text-ink-muted transition-colors hover:text-ink'
]);

/**
 * Меню в бургере.
 *
 * Компонент больше не читает сессию: `verifySession()` вызывает `cookies()`,
 * а это переводит весь маршрут в динамический рендер и обнуляет ISR
 * (см. `ui/auth-nav-link.tsx`). Пункт, который зависит от входа, вынесен
 * в клиентский `AuthNavLink`.
 */
export const MainNav: FC = () => (
  <nav
    className={cnMainNav(null, ['flex flex-col items-start gap-2 font-oswald'])}
  >
    {NAV_LINKS.map(({ href, title }) => (
      <Link className={linkClassName} href={href} key={href}>
        {title}
      </Link>
    ))}
    {/* Пока регион один, переключатель не рендерится: выбор из одного
        пункта — не выбор. Регион задаётся реестром, а не базой, поэтому
        условие считается на сборке и в динамику маршрут не переводит. */}
    {getPublishedRegions().length > 1 && (
      <RegionSwitcher className={linkClassName} />
    )}
    <MyBookingsNavLink className={linkClassName} />
    <AuthNavLink className={linkClassName} />
  </nav>
);
