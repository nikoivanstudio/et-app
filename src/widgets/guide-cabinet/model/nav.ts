import { CabinetBadges } from '@/features/cabinet/server';

import { routes } from '@/kernel/routes';

export type CabinetSection =
  | 'overview'
  | 'bookings'
  | 'messages'
  | 'tours'
  | 'reviews'
  | 'profile';

export type CabinetNavItem = {
  id: CabinetSection;
  label: string;
  /** Короткая подпись для нижней панели на телефоне. */
  shortLabel: string;
  href: string;
  /** Счётчик справа: золотой — то, что ждёт действия, серый — просто число. */
  count?: number;
  countTone?: 'gold' | 'mute';
};

export const buildCabinetNav = (
  userId: number,
  badges: CabinetBadges
): CabinetNavItem[] => [
  {
    id: 'overview',
    label: 'Обзор',
    shortLabel: 'Обзор',
    href: routes.cabinet.overview(userId)
  },
  {
    id: 'bookings',
    label: 'Заявки',
    shortLabel: 'Заявки',
    href: routes.cabinet.bookings(userId),
    count: badges.newBookings,
    countTone: 'gold'
  },
  {
    id: 'messages',
    label: 'Сообщения',
    shortLabel: 'Чат',
    href: routes.cabinet.messages(userId),
    count: badges.unreadMessages,
    countTone: 'gold'
  },
  {
    id: 'tours',
    label: 'Туры',
    shortLabel: 'Туры',
    href: routes.cabinet.tours(userId),
    count: badges.toursCount,
    countTone: 'mute'
  },
  {
    id: 'reviews',
    label: 'Отзывы',
    shortLabel: 'Отзывы',
    href: routes.cabinet.reviews(userId)
  },
  {
    id: 'profile',
    label: 'Профиль',
    shortLabel: 'Я',
    href: routes.cabinet.profile(userId)
  }
];
