'use server';

import { cn } from '@bem-react/classname';
import Link from 'next/link';
import { FC } from 'react';

import { sessionService } from '@/entities/user/services/session';

const cnMainNav = cn('MainNav');
const links = [
  { href: '/tours', title: 'Экскурсии' },
  { href: '/dzhip-tur-krym', title: 'Джип туры' },
  { href: '/uslugi', title: 'Услуги' },
  { href: '/posts', title: 'Интересное' },
  { href: '/kontakty', title: 'Контакты' }
];

export const MainNav: FC = async () => {
  const { session } = await sessionService.verifySession();
  const linksToRender = !!session?.id
    ? [...links, { href: `/account/${session.id}`, title: 'Профиль' }]
    : [
        ...links,
        {
          href: '/sign-in',
          title: 'Войти'
        }
      ];

  return (
    <nav
      className={cnMainNav(null, [
        'flex items-start gap-6 text-sm font-medium flex-col md:text-2xl lg:text-3xl'
      ])}
    >
      {linksToRender.map(({ href, title }) => (
        <Link
          className={cnMainNav('Link', [
            'px-4',
            'transition-colors hover:text-foreground/80 text-foreground/60'
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
