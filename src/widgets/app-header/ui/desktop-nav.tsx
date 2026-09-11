import { cn } from '@bem-react/classname';
import Link from 'next/link';
import { FC } from 'react';

import { NAV_LINKS } from '@/widgets/app-header/model/links';
import { AuthNavLink } from '@/widgets/app-header/ui/auth-nav-link';

const cnDesktopNav = cn('DesktopNav');

const linkClassName = cnDesktopNav('Link', [
  'text-[15px] text-white transition-colors hover:text-gold-photo'
]);

/**
 * Горизонтальное меню от md: — до v2 бургер был на любой ширине.
 *
 * Сессию, как и `MainNav`, компонент не читает: пункт «Войти/Профиль»
 * приходит из клиентского `AuthNavLink`, иначе `cookies()` в серверном
 * рендере ломает ISR на всех публичных страницах.
 */
export const DesktopNav: FC = () => (
  <nav className={cnDesktopNav(null, ['flex items-center gap-6 font-oswald'])}>
    {NAV_LINKS.map(({ href, title }) => (
      <Link className={linkClassName} href={href} key={href}>
        {title}
      </Link>
    ))}
    <AuthNavLink className={linkClassName} />
  </nav>
);
