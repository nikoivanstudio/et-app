import { notFound } from 'next/navigation';
import { FC } from 'react';

import { placeServices } from '@/kernel/place/server';
import { PlaceView } from '@/views/place/server';

export const revalidate = 86400;

/**
 * Адреса объектов известны заранее и их немного (первая очередь — семь
 * штук), поэтому страницы пререндерятся целиком. Новый объект, заведённый
 * после сборки, соберётся при первом обращении и дальше пойдёт из кеша.
 */
export async function generateStaticParams() {
  try {
    const places = await placeServices.getPublishedPlaces();

    return places.map(place => ({ slug: place.slug }));
  } catch {
    // Образ собирается без DATABASE_URL — как и в sitemap, недоступность
    // базы означает лишь отсутствие пререндера, а не падение сборки.
    return [];
  }
}

const Page: FC<{ params: Promise<{ slug: string }> }> = async ({ params }) => {
  const { slug } = await params;
  const either = await placeServices.getPlaceBySlug(slug);

  // Объекта с таким адресом нет — это 404, а не страница с ошибкой.
  if (either.type === 'left') {
    notFound();
  }

  return <PlaceView {...either.value} />;
};

export default Page;
