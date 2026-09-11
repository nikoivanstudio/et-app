'use server';

import Link from 'next/link';
import { FC, ReactNode } from 'react';

import { AppMain } from '@/widgets/app-main/ui/app-main';
import { CONTACTS } from '@/widgets/contacts/constants/contacts';

import { SectionBody, SectionHead } from '@/entities/page-head/server';

import { formatNumber } from '@/shared/lib/string-utils';
import { LinkButton } from '@/shared/ui/link-button';
import { PhoneIcon } from '@/shared/ui/PhoneIcon';
import { SectionHeading } from '@/shared/ui/section-heading';
import {
  MailGlyph,
  MaxGlyph,
  TelegramGlyph,
  VideoGlyph,
  VkGlyph
} from '@/shared/ui/social-glyphs';

import { YandexMap } from '@/views/contacts/ui/yandex-map';

const GOLD = '#8b6f3d';

const ContactRow: FC<{
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  /** Телефон и почта крупнее адреса — по ним звонят. */
  strong?: boolean;
}> = ({ icon, label, value, href, strong }) => {
  const body = (
    <>
      <span className='border-rule bg-cream-deep flex size-10 shrink-0 items-center justify-center rounded-full border'>
        {icon}
      </span>
      <span className='min-w-0 flex-1'>
        <span className='font-oswald text-ink-faint block text-[11.5px] tracking-[0.6px] uppercase'>
          {label}
        </span>
        <span
          className={
            strong
              ? 'font-oswald text-ink block text-[19px] font-medium'
              : 'font-caladea text-ink block text-[14.5px] leading-snug'
          }
        >
          {value}
        </span>
      </span>
    </>
  );

  const className =
    'border-rule bg-cream rounded-block flex min-h-[62px] items-center gap-3 border px-3.5 py-2.5';

  return href ? (
    <a
      className={`${className} hover:bg-cream-deep transition-colors`}
      href={href}
    >
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
};

const MESSENGERS: { href: string; label: string; icon: ReactNode }[] = [
  {
    href: CONTACTS.telegram,
    label: 'Telegram',
    icon: <TelegramGlyph />
  },
  { href: CONTACTS.max, label: 'MAX', icon: <MaxGlyph /> },
  { href: CONTACTS.vk, label: 'ВКонтакте', icon: <VkGlyph /> },
  { href: CONTACTS.ruTube, label: 'Видео', icon: <VideoGlyph /> }
];

/**
 * Контакты.
 *
 * Было: шапка 85vh с чужим фото, «КОНТАКТЫ» золотом обрезано правым краем,
 * а адрес, телефоны и мессенджеры висели полупрозрачным слоем поверх карты —
 * отдельного блока контактов на странице не существовало. На 1440 карта не
 * отрисовывалась совсем: 1300px серой сетки.
 */
export const ContactsView: FC = async () => (
  <AppMain
    mainHead={
      <SectionHead
        page='contacts'
        kicker='Бахчисарай · выезд по всему Крыму'
        title='Контакты'
        lead='Позвоните или напишите — подберём маршрут под ваши даты и состав группы.'
      />
    }
    mainContent={
      <SectionBody>
        <div className='mx-auto w-full max-w-[720px]'>
          <div className='flex flex-col gap-2'>
            {CONTACTS.phones.map(phone => (
              <ContactRow
                key={phone}
                strong
                href={`tel:${phone}`}
                label='Телефон'
                value={formatNumber(phone)}
                icon={<PhoneIcon color={GOLD} width={16} height={18} />}
              />
            ))}
            <ContactRow
              href={`mailto:${CONTACTS.email}`}
              label='Почта'
              value={CONTACTS.email}
              icon={<MailGlyph size={17} className='text-gold-head' />}
            />
            <ContactRow
              label='Адрес'
              value={CONTACTS.address}
              icon={
                <svg
                  width='17'
                  height='17'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke={GOLD}
                  strokeWidth='1.7'
                  strokeLinecap='round'
                  aria-hidden='true'
                >
                  <path d='M12 22s7-5.6 7-12a7 7 0 1 0-14 0c0 6.4 7 12 7 12z' />
                  <circle cx='12' cy='10' r='2.6' />
                </svg>
              }
            />
          </div>

          <SectionHeading>Мессенджеры</SectionHeading>
          {/* Было: четыре разноцветных растровых логотипа — единственное цветное
              пятно на сайте. Стали монохромными пилюлями с тап-таргетом 48. */}
          <ul className='flex flex-wrap gap-2'>
            {MESSENGERS.map(({ href, label, icon }) => (
              <li key={label}>
                <Link
                  className='border-rule bg-cream hover:bg-cream-deep rounded-pill font-oswald text-ink flex min-h-12 items-center gap-2 border px-4 text-[13.5px] transition-colors'
                  href={href}
                >
                  {icon}
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <SectionHeading>Как добраться</SectionHeading>
          <YandexMap />
          <a
            className='font-oswald text-gold-ink mt-2 inline-flex min-h-11 items-center text-[13px] hover:underline'
            href='https://yandex.ru/maps/?text=Бахчисарай'
          >
            Открыть в Яндекс.Картах →
          </a>

          <div className='border-rule bg-cream rounded-block mt-7 border p-5 text-center'>
            <p className='font-caladea text-ink-muted text-[15px] leading-relaxed'>
              Подберём маршрут под ваши даты и состав группы.
            </p>
            <LinkButton
              className='mt-4 w-full md:w-[260px]'
              href={`tel:${CONTACTS.phones[0]}`}
            >
              Позвонить
            </LinkButton>
          </div>

          <div className='h-14' />
        </div>
      </SectionBody>
    }
    mainBottom={null}
  />
);
