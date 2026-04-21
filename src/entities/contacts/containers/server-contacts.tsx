'use server';

import { FC } from 'react';

import { ContactsProps } from '@/entities/contacts/domain';
import { ContactsLayout } from '@/entities/contacts/ui/contacts-layout';

export const ServerContacts: FC<ContactsProps> = async props => (
  <ContactsLayout {...props} />
);
