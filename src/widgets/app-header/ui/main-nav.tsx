import { cn } from '@bem-react/classname';
import Link from 'next/link';
import { FC } from 'react';

import { NAV_LINKS } from '@/widgets/app-header/model/links';
import { AuthNavLink } from '@/widgets/app-header/ui/auth-nav-link';

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
    <AuthNavLink className={linkClassName} />
  </nav>
);
