'use client';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

const cnContacts = cn('Contacts');

export const YandexMap: FC = () => (
  <div
    className={cnContacts(null, [
      'max-h-9/12',
      'max-w-full',
      'object-cover',
      'rounded-xs'
    ])}
    dangerouslySetInnerHTML={{
      __html: `
<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A74a98f5ea7e6cc92fff70b30fa7dc44c4aaf841ed214817c3f9a5d8eedf7c4d4&amp;source=constructor" width="100%" height="720" frameborder="0"></iframe>`
    }}
  />
);
