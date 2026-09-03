'use server';

import { cn } from '@bem-react/classname';
import Link from 'next/link';
import { FC } from 'react';

import { NAV_LINKS } from '@/widgets/app-header/model/links';

import { sessionService } from '@/entities/user/services/session';

const cnDesktopNav = cn('DesktopNav');

/** Горизонтальное меню от md: — до v2 бургер был на любой ширине. */
export const DesktopNav: FC = async () => {
  const { session } = await sessionService.verifySession();

  const linksToRender = session?.id
    ? [...NAV_LINKS, { href: `/account/${session.id}`, title: 'Профиль' }]
    : [...NAV_LINKS, { href: '/sign-in', title: 'Войти' }];

  return (
    <nav
      className={cnDesktopNav(null, ['flex items-center gap-6 font-oswald'])}
    >
      {linksToRender.map(({ href, title }) => (
        <Link
          className={cnDesktopNav('Link', [
            'text-[15px] text-white transition-colors hover:text-gold-photo'
          ])}
          href={href}
          key={href}
        >
          {title}
        </Link>
      ))}
    </nav>
  );
};
