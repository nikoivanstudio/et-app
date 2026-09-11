import { cn } from '@bem-react/classname';
import Link from 'next/link';
import { FC } from 'react';

import { CONTACTS } from '@/widgets/contacts/constants/contacts';

import { ContactIcon } from '@/shared/ui/contact-icon';
import { TelegramGlyph, WhatsAppGlyph } from '@/shared/ui/social-glyphs';

const cnContacts = cn('Contacts');

/**
 * Контакты в шапке.
 *
 * Телефон здесь был захардкожен — `+79781113801`, и это не один из двух
 * номеров организации: на каждой странице сайта человеку показывали номер,
 * которого нет ни в подвале, ни на странице контактов, ни в разметке
 * организации. Теперь он берётся из `CONTACTS`, как везде.
 *
 * Рядом — Telegram и WhatsApp (A7). В нише это основной канал заявок,
 * и держать его только в подвале значит терять обращения с любой
 * страницы, докуда человек не долистал.
 */
export const Contacts: FC = () => (
  <div className={cnContacts(null, ['flex items-center gap-1'])}>
    <Link
      aria-label='Написать в Telegram'
      className='hover:text-gold-photo flex size-9 items-center justify-center text-inherit transition-colors'
      href={CONTACTS.telegram}
      rel='noopener'
      target='_blank'
    >
      <TelegramGlyph size={20} />
    </Link>
    <Link
      aria-label='Написать в WhatsApp'
      className='hover:text-gold-photo flex size-9 items-center justify-center text-inherit transition-colors'
      href={CONTACTS.whatsapp}
      rel='noopener'
      target='_blank'
    >
      <WhatsAppGlyph size={20} />
    </Link>
    <a
      aria-label='Позвонить'
      className='text-inherit'
      href={`tel:${CONTACTS.phones[0]}`}
    >
      <ContactIcon />
    </a>
  </div>
);
