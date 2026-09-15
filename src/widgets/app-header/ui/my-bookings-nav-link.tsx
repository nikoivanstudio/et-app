'use client';

import Link from 'next/link';
import { FC } from 'react';

import { useLocalBookingTokens } from '@/features/booking/hooks/use-local-bookings';

import { MY_BOOKINGS_PATH } from '@/entities/booking/lib/local-bookings';

type Props = {
  className?: string;
};

/**
 * Пункт «Мои заявки» — только для тех, у кого заявки есть.
 *
 * Гость оставляет заявку без регистрации, и ссылка на переписку живёт
 * в письме и в localStorage этого браузера. Без пункта в меню страница
 * списка была бы достижима только по той самой ссылке, которую он и ищет.
 *
 * Хранилище читается клиентом: сессию и localStorage шапка на сервере
 * не трогает (см. `auth-nav-link.tsx` — чтение cookies обнуляет ISR
 * публичных страниц), поэтому до гидратации пункта нет.
 */
export const MyBookingsNavLink: FC<Props> = ({ className }) => {
  const tokens = useLocalBookingTokens();

  if (!tokens.length) {
    return null;
  }

  return (
    <Link className={className} href={MY_BOOKINGS_PATH}>
      Мои заявки
    </Link>
  );
};
