'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { ContactIcon } from '@/shared/ui/contact-icon';

const cnContacts = cn('Contacts');

export const Contacts: FC = async () => (
  <div className={cnContacts()}>
    <a className='text-inherit' href={`tel:+79781113801`}>
      <ContactIcon />
    </a>
  </div>
);
