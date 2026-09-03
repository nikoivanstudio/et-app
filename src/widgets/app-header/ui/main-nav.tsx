'use server';

import { cn } from '@bem-react/classname';
import Link from 'next/link';
import { FC } from 'react';

import { NAV_LINKS } from '@/widgets/app-header/model/links';

import { sessionService } from '@/entities/user/services/session';

const cnMainNav = cn('MainNav');

export const MainNav: FC = async () => {
  const { session } = await sessionService.verifySession();
  const linksToRender = !!session?.id
    ? [...NAV_LINKS, { href: `/account/${session.id}`, title: 'Профиль' }]
    : [
        ...NAV_LINKS,
        {
          href: '/sign-in',
          title: 'Войти'
        }
      ];

  return (
    <nav
      className={cnMainNav(null, [
        'flex flex-col items-start gap-2 font-oswald'
      ])}
    >
      {linksToRender.map(({ href, title }) => (
        <Link
          className={cnMainNav('Link', [
            'flex min-h-11 items-center px-4 text-base',
            'text-ink-muted transition-colors hover:text-ink'
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
