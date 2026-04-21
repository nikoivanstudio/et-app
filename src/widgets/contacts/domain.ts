import { PropsWithChildren } from 'react';

import { ContactsProps } from '@/entities/contacts';

import { PropsWithClassNames } from '@/shared/model/types';

enum Types {
  SERVER = 'server',
  CLIENT = 'client'
}

type ContactsLayoutTypes<T extends Types[keyof Types] = string> = T;

export type ContactsLayoutProps = PropsWithChildren<
  ContactsProps & PropsWithClassNames & { type: ContactsLayoutTypes }
>;
