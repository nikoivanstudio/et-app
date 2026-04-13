import { ReactNode } from 'react';

import { PropsWithClassNames } from '@/shared/model/types';

enum Pages {
  HOME = 'home',
  TOUR = 'tour',
  SERVICES = 'services',
  OTHER = 'other'
}

type PageType<
  T extends string = Pages,
  K extends keyof Pages = keyof Pages
> = T[K];

export type PageHeadProps = {
  title: ReactNode;
  content: ReactNode;
  page?: PageType;
} & PropsWithClassNames;
