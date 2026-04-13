'use server';

import { FC } from 'react';

import { CONTACTS } from '@/widgets/contacts/constants/contacts';
import { ContactsLayout } from '@/widgets/contacts/ui/contacts-layout';

import { Rights } from '@/shared/ui/rights';

export const ContactsWidget: FC = async () => (
  <ContactsLayout type='server' {...CONTACTS}>
    <Rights />
  </ContactsLayout>
);
