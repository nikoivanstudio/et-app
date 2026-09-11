'use server';

import { FC } from 'react';

import { AppHeader } from '@/widgets/app-header/containers/app-header';
import { AppMain } from '@/widgets/app-main/server';
import { CONTACTS } from '@/widgets/contacts/constants/contacts';

import { SectionBody, SectionHead } from '@/entities/page-head/server';

import { sectionCrumbs } from '@/shared/lib/seo/breadcrumbs';
import { LegacyTourCard } from '@/shared/ui/legacy-tour-card';
import { LinkButton } from '@/shared/ui/link-button';

import { services } from '@/views/legacy/constants/services';

/**
 * Каталог услуг.
 *
 * Было: шапка 85vh с чужим фото, «УСЛУГИ» золотом справа с трекингом 4px —
 * обрезалось правым краем окна, а под ней `flex justify-center flex-wrap`
 * с карточками, у которых нет собственной ширины: восемь штук рендерились
 * 0×320, подписи уезжали за экран на x=527, между шапкой и подвалом висело
 * 330px пустоты. Стало: полоса 300/420 со своим кадром, контейнер 1120 и та
 * же сетка, что в каталоге туров.
 */
export const ServicesView: FC = async () => (
  <>
    <AppHeader variant='public' />
    <AppMain
      mainHead={
        <SectionHead
          page='services'
          kicker={`${services.length} услуг · прокат и аренда · Крым`}
          title='Услуги'
          lead='Внедорожник с водителем, квадроциклы и снегоходы, палатки и место в кемпинге. Всё, что нужно к выезду, — в одном месте.'
        />
      }
      mainContent={
        <SectionBody crumbs={sectionCrumbs('Услуги')}>
          <ul className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {services.map(({ id, ...rest }) => (
              <li key={id}>
                <LegacyTourCard tour={rest} />
              </li>
            ))}
          </ul>

          <div className='border-rule bg-cream rounded-block mt-10 border p-5 text-center md:p-7'>
            <p className='font-caladea text-ink-muted text-[15px] leading-relaxed'>
              Не нашли нужное? Соберём выезд под ваш запрос — маршрут,
              снаряжение и машины.
            </p>
            <LinkButton
              className='mt-4 w-full md:w-[260px]'
              href={`tel:${CONTACTS.phones[0]}`}
            >
              Позвонить
            </LinkButton>
          </div>

          <div className='h-14' />
        </SectionBody>
      }
      mainBottom={null}
    />
  </>
);
