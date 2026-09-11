import { notFound } from 'next/navigation';
import { FC } from 'react';

import { findRouteLanding, getRouteLandings } from '@/entities/landing/server';

import { HOME_CRUMB } from '@/shared/lib/seo/breadcrumbs';

import { LandingView } from '@/views/landing/server';

/**
 * Связки «откуда → куда» из города Бахчисарай (E4).
 *
 * Сегмент отправления статический, а не динамический, потому что Next
 * не умеет дробить сегмент на постоянную и переменную части
 * (`iz-[from]` невозможен), а класть связки в корневой `[slug]` нельзя —
 * там живут 770 статей справочника, и любой промах уводил бы на них.
 *
 * `dynamicParams = false`: существуют только перечисленные в реестре
 * адреса. Открытый сегмент здесь — прямой путь к сотне пустых страниц.
 */
const FROM_SEGMENT = 'iz-bahchisaraya';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getRouteLandings(FROM_SEGMENT).map(landing => ({ to: landing.slug }));
}

const Page: FC<{ params: Promise<{ to: string }> }> = async ({ params }) => {
  const { to } = await params;
  const landing = findRouteLanding(FROM_SEGMENT, to);

  if (!landing) {
    notFound();
  }

  return (
    <LandingView
      landing={landing}
      crumbs={[
        HOME_CRUMB,
        { label: 'Джип-туры', href: '/dzhip-tur-krym' },
        { label: 'Бахчисарай', href: '/dzhip-tury/bahchisaray' },
        { label: landing.title }
      ]}
      page='geo'
    />
  );
};

export default Page;
