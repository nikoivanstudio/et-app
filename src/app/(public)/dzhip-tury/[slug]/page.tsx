import { notFound } from 'next/navigation';
import { FC } from 'react';

import {
  findDzhipTuryLanding,
  getDzhipTuryLandings
} from '@/entities/landing/server';

import { geoCrumbs } from '@/shared/lib/seo/breadcrumbs';

import { LandingView } from '@/views/landing/server';

/**
 * Гео-страницы городов (E3) и форматные посадочные (E5) живут в одном
 * сегменте: для поисковика это одна ось раздела, и разводить их по разным
 * папкам значило бы завести уровень вложенности, который ничего
 * не объясняет.
 *
 * `dynamicParams = false` — важная часть задачи E5. Открытый сегмент
 * означал бы, что `/dzhip-tury/что-угодно` отдаёт страницу: тысяча пустых
 * адресов ровно того вида, который в плане назван главной опасностью
 * фильтров. Здесь существуют только те адреса, что перечислены в реестре.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  return getDzhipTuryLandings().map(landing => ({ slug: landing.slug }));
}

const Page: FC<{ params: Promise<{ slug: string }> }> = async ({ params }) => {
  const { slug } = await params;
  const landing = findDzhipTuryLanding(slug);

  if (!landing) {
    notFound();
  }

  return (
    <LandingView
      landing={landing}
      crumbs={geoCrumbs(landing.title)}
      page={landing.startCity ? 'geo' : 'tours'}
    />
  );
};

export default Page;
