import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { ContactsLayoutProps } from '@/widgets/contacts/domain';

import { ServerContacts } from '@/entities/contacts/server';

import { Title } from '@/shared/ui/title';

import styles from '../assets/styles.module.scss';

const cnContactsWidget = cn('ContactsWidget');

export const ContactsLayout: FC<ContactsLayoutProps> = ({
  type,
  children,
  className,
  ...contactsProps
}) => (
  <div
    className={cnContactsWidget({ type }, [styles.ContactsWidget, className])}
  >
    <div className={cnContactsWidget('Header', [styles.ContactsWidget_Header])}>
      <Title type='h2'>Контакты</Title>
    </div>
    <div className='flex flex-col justify-center items-center mt-6'>
      <ServerContacts {...contactsProps} />
      {children}
    </div>
  </div>
);
