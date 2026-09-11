'use client';

import Link from 'next/link';
import { FC } from 'react';

import { useUserSession } from '@/entities/user/hooks/use-user-session';

type Props = {
  className?: string;
};

/**
 * Последний пункт меню: «Войти» или «Профиль».
 *
 * Клиентский компонент здесь — не украшение, а единственное место в шапке,
 * которому нужна сессия. Раньше её читали `MainNav`, `DesktopNav` и сам
 * `AppHeader` — три вызова `cookies()` на каждой публичной странице сайта.
 * Любое обращение к cookies переводит маршрут в динамический рендер, поэтому
 * объявленный в `(public)/[slug]/page.tsx` `revalidate = 86400` не работал
 * никогда: все 868 страниц собирались заново на каждый запрос, а ответ уходил
 * с `Cache-Control: private, no-cache, no-store`.
 *
 * Сессия подтягивается запросом к `/api/session` после гидратации. До ответа
 * показываем «Войти»: это состояние по умолчанию для незалогиненного
 * посетителя, а поисковик видит ровно тот же HTML, что и человек без cookie.
 */
export const AuthNavLink: FC<Props> = ({ className }) => {
  const { session } = useUserSession();

  const { href, title } = session?.id
    ? { href: `/account/${session.id}`, title: 'Профиль' }
    : { href: '/sign-in', title: 'Войти' };

  return (
    <Link className={className} href={href}>
      {title}
    </Link>
  );
};
