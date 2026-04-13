import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { ContactsLayoutProps } from '@/widgets/contacts/domain';
import { Row } from '@/widgets/contacts/ui/row';
import { SocialItem } from '@/widgets/contacts/ui/social-item';

import { formatNumber } from '@/shared/lib/string-utils';
import { GeoPointIcon } from '@/shared/ui/GeoPointIcon';
import { MailIcon } from '@/shared/ui/mailIcon';
import { PhoneIcon } from '@/shared/ui/PhoneIcon';
import { RutubeIcon } from '@/shared/ui/rutube-icon';
import { TelegrammIcon } from '@/shared/ui/telegramm-icon';
import { Title } from '@/shared/ui/title';
import { VkIcon } from '@/shared/ui/vk-icon';
import { WhatsAppIcon } from '@/shared/ui/whats-app-icon';

import styles from '../assets/styles.module.scss';

const cnContactsWidget = cn('ContactsWidget');

export const ContactsLayout: FC<ContactsLayoutProps> = ({
  type,
  address,
  email,
  phones,
  children,
  telegram,
  whatsapp,
  vk,
  ruTube,
  className
}) => (
  <div
    className={cnContactsWidget({ type }, [styles.ContactsWidget, className])}
  >
    <div className={cnContactsWidget('Header', [styles.ContactsWidget_Header])}>
      <Title type='h2'>Контакты</Title>
    </div>
    <div className='flex flex-col justify-center items-center mt-6'>
      <Row>
        <GeoPointIcon fill='#000' />
        <span>{address}</span>
      </Row>
      <Row>
        <MailIcon />
        <a href={`mailto:${email}`}>{email}</a>
      </Row>
      {phones.map((phone, idx) => (
        <a href={`tel:${phone}`} key={idx}>
          <Row>
            <PhoneIcon />
            {formatNumber(phone)}
          </Row>
        </a>
      ))}
      <ul
        className={cnContactsWidget('SocialList', [
          'flex',
          'items-center',
          'gap-5',
          'mt-8.5'
        ])}
      >
        <li>
          <SocialItem href={telegram} icon={<TelegrammIcon />} />
        </li>
        <li>
          <SocialItem href={whatsapp} icon={<WhatsAppIcon />} />
        </li>
        <li>
          <SocialItem href={vk} icon={<VkIcon />} />
        </li>
        {!!ruTube && (
          <li>
            <SocialItem href={ruTube} icon={<RutubeIcon />} />
          </li>
        )}
      </ul>
      {children}
    </div>
  </div>
);
