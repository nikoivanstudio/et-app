'use server';

import Image from 'next/image';
import Link from 'next/link';
import { FC, ReactNode } from 'react';

import { CONTACTS } from '@/widgets/contacts/constants/contacts';

import logo from '@/shared/assets/images/logo.png';
import { getCurrentYear } from '@/shared/lib/seo/current-year';
import { formatNumber } from '@/shared/lib/string-utils';
import {
  MaxGlyph,
  TelegramGlyph,
  VideoGlyph,
  VkGlyph
} from '@/shared/ui/social-glyphs';

const NAV: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Туры',
    links: [
      { label: 'Все туры', href: '/category/vse_tury' },
      { label: 'Каталог туров', href: '/tours' },
      { label: 'Джип-туры по Крыму', href: '/dzhip-tur-krym' },
      { label: 'Экскурсии по Крыму', href: '/ekskursii_po_krymu' }
    ]
  },
  {
    title: 'Услуги',
    links: [
      {
        label: 'Аренда внедорожника',
        href: '/uslugi/arenda-vnedorozhnika-s-voditelem-v-krymu'
      },
      {
        label: 'Прокат квадроциклов',
        href: '/uslugi/prokat-kvadrotsiklov-v-krymu'
      },
      {
        label: 'Место в кемпинге',
        href: '/uslugi/arenda-mesta-v-kempinge-v-krymu'
      },
      { label: 'Все услуги', href: '/uslugi' }
    ]
  },
  {
    title: 'О нас',
    links: [
      { label: 'Отзывы', href: '/otzyvy' },
      { label: 'Интересное о Крыме', href: '/posts' },
      { label: 'Ближайшие выезды', href: '/activities' },
      { label: 'Контакты', href: '/kontakty' }
    ]
  }
];

const SOCIALS: { href: string; label: string; icon: ReactNode }[] = [
  { href: CONTACTS.telegram, label: 'Telegram', icon: <TelegramGlyph /> },
  { href: CONTACTS.max, label: 'MAX', icon: <MaxGlyph /> },
  { href: CONTACTS.vk, label: 'ВКонтакте', icon: <VkGlyph /> },
  { href: CONTACTS.ruTube, label: 'Видео', icon: <VideoGlyph /> }
];

const navLinkClass =
  'font-caladea text-cream/70 hover:text-gold-photo flex min-h-9 items-center text-[14px] transition-colors';

/**
 * Подвал сайта.
 *
 * Было: блок на фотографии с заголовком «Контакты» (дублировал одноимённую
 * страницу), адрес и телефоны Poiret по кадру без скрима — «Республика
 * Крым…» уходила в 3,1:1, четыре разноцветных растровых логотипа в кружках
 * 20% белого — единственное цветное пятно на сайте вне фотографий. Ни
 * навигации, ни года, ни возможности уйти куда-то, кроме шапки.
 *
 * Стало: тушь вместо фото, навигация тремя колонками, монохромные значки,
 * телефоны Oswald как самое крупное в подвале.
 */
export const ContactsWidget: FC = async () => (
  <div className='bg-ink'>
    <div className='mx-auto max-w-[1120px] px-4 py-12 md:px-6 md:py-16'>
      <div className='md:flex md:gap-14'>
        <div className='md:w-[240px] md:shrink-0'>
          <Image
            src={logo}
            alt='Energy Tour'
            width={44}
            height={50}
            className='h-[50px] w-auto object-contain'
          />
          <p className='font-oswald text-gold-photo mt-2.5 text-[12px] tracking-[2px] uppercase'>
            Energy Tour · Крым
          </p>
          <p className='font-caladea text-cream/70 mt-1.5 text-[14px] leading-relaxed'>
            Джип-туры и индивидуальные экскурсии. Выезд из Бахчисарая,
            Севастополя и Ялты.
          </p>

          <ul className='mt-5 flex gap-2'>
            {SOCIALS.map(({ href, label, icon }) => (
              <li key={label}>
                <Link
                  className='text-gold-photo hover:bg-gold-photo/15 flex size-11 items-center justify-center rounded-full bg-white/10 transition-colors'
                  href={href}
                  aria-label={label}
                >
                  {icon}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className='mt-10 md:mt-0 md:flex md:flex-1 md:gap-10'>
          {NAV.map(({ title, links }) => (
            <nav key={title} className='mt-7 first:mt-0 md:mt-0 md:flex-1'>
              <h2 className='font-oswald text-cream/45 text-[11.5px] tracking-[1.6px] uppercase'>
                {title}
              </h2>
              <ul className='mt-1.5'>
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link className={navLinkClass} href={href}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className='mt-7 md:mt-0 md:w-[210px] md:shrink-0'>
            <h2 className='font-oswald text-cream/45 text-[11.5px] tracking-[1.6px] uppercase'>
              Позвонить
            </h2>
            {CONTACTS.phones.map(phone => (
              <a
                key={phone}
                className='font-oswald text-cream hover:text-gold-photo mt-1.5 flex min-h-11 items-center text-[18px] transition-colors'
                href={`tel:${phone}`}
              >
                {formatNumber(phone)}
              </a>
            ))}
            <a className={navLinkClass} href={`mailto:${CONTACTS.email}`}>
              {CONTACTS.email}
            </a>
            <p className='font-caladea text-cream/55 mt-1.5 text-[13.5px]'>
              {CONTACTS.address}
            </p>
          </div>
        </div>
      </div>

      <div className='mt-10 border-t border-white/12 pt-5'>
        <p className='font-oswald text-cream/45 text-[12px] tracking-wide'>
          © {getCurrentYear()} Energy Tour
        </p>
      </div>
    </div>
  </div>
);
