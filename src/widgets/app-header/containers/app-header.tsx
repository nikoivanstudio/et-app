import { FC } from 'react';

import { Contacts } from '@/widgets/app-header/ui/contacts';
import { DesktopNav } from '@/widgets/app-header/ui/desktop-nav';
import { Layout } from '@/widgets/app-header/ui/layout';
import { Logo } from '@/widgets/app-header/ui/logo';
import { MainNav } from '@/widgets/app-header/ui/main-nav';

import { ToggleTheme } from '@/features/theme/toogle-theme';

type AppHeaderProps = {
  variant: 'auth' | 'private' | 'public';
};

/**
 * Шапка публичных страниц.
 *
 * Здесь больше нет чтения сессии, и это главное изменение: `verifySession()`
 * шёл через `cookies()`, а любое обращение к cookies в серверном рендере
 * переводит маршрут в динамику. Из-за этого `revalidate = 86400`
 * на `(public)/[slug]` не действовал, ответ уходил с
 * `Cache-Control: private, no-cache, no-store`, и каждая из 868 страниц
 * собиралась заново на каждый запрос.
 *
 * Заодно снят давний баг: вызов шёл БЕЗ `await`, то есть в условии
 * `!!session` всегда стоял промис — истинный при любом исходе проверки.
 * Блок профиля показывался кому угодно, включая неавторизованных. В соседних
 * `main-nav.tsx` и `desktop-nav.tsx` тот же вызов был сделан через `await`.
 *
 * Единственный пункт шапки, которому нужна сессия, — «Войти/Профиль»:
 * он живёт в клиентском `AuthNavLink` и спрашивает `/api/session` сам.
 */
export const AppHeader: FC<AppHeaderProps> = ({ variant }) => (
  <Layout
    nav={<MainNav />}
    desktopNav={variant === 'auth' ? undefined : <DesktopNav />}
    logo={<Logo />}
    actions={<ToggleTheme />}
    rightNode={<Contacts />}
  />
);
