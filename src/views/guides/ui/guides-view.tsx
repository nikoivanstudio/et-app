'use server';

import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/server';

import { GuideCard } from '@/entities/guide';
import { SectionBody, SectionHead } from '@/entities/page-head/server';

import { buildItemListJsonLd } from '@/shared/lib/seo/json-ld';
import { EmptyState } from '@/shared/ui/empty-state';
import { JsonLd } from '@/shared/ui/json-ld';
import { LinkButton } from '@/shared/ui/link-button';

import type { KernelGuideDomain } from '@/kernel/guide/server';

type Props = {
  guides: KernelGuideDomain.GuideSummary[];
};

/**
 * Раздел гидов: `/guides` (E6).
 *
 * Маршрут `/guide/[slug]` был написан, а попасть на него было неоткуда —
 * ни листинга, ни ссылки ниоткуда, кроме карточки тура. То есть страницы
 * существовали только для sitemap.
 *
 * Почему это важнее, чем кажется: профили гидов со стажем, техникой,
 * маршрутами и отзывами по каждому — единственное, чего нет ни у одного
 * федерального агрегатора. Яндекс читает такие страницы как E-E-A-T,
 * то есть как подтверждение, что за услугой стоят конкретные люди.
 */
export const GuidesView: FC<Props> = async ({ guides }) => (
  <AppMain
    mainHead={
      <SectionHead
        page='guides'
        kicker={
          guides.length ? `${guides.length} гидов · Крым` : 'Кто водит маршруты'
        }
        title='Наши гиды'
        lead='Водители-инструкторы, которые водят джип-туры: стаж, техника, маршруты и отзывы по каждому.'
      />
    }
    mainContent={
      <SectionBody className='pb-16'>
        <JsonLd
          data={buildItemListJsonLd({
            path: '/guides',
            name: 'Гиды Energy Tour',
            items: guides.map(guide => ({
              title: guide.displayName,
              path: `/guide/${guide.slug}`
            }))
          })}
        />

        {guides.length ? (
          <ul className='flex flex-col gap-3 md:grid md:grid-cols-2'>
            {guides.map(guide => (
              <li key={guide.slug}>
                <GuideCard guide={guide} />
              </li>
            ))}
          </ul>
        ) : (
          /* В базе один пользователь-гид и тот без профиля (A1), поэтому
             сегодня раздел пуст. Пустой <ul> между шапкой и подвалом —
             ровно то, из-за чего /tours выглядела сломанной. */
          <EmptyState
            title='Профили гидов заполняются'
            text='Пока о маршруте проще спросить напрямую: расскажем, кто поведёт и на какой технике.'
            action={
              <LinkButton className='w-full md:w-[260px]' href='/kontakty'>
                Связаться
              </LinkButton>
            }
          />
        )}
      </SectionBody>
    }
    mainBottom={null}
  />
);
