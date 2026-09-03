'use server';

import { notFound } from 'next/navigation';
import { FC } from 'react';

import { ServerTourProps } from '@/shared/model/types';

import { tourServices } from '@/kernel/tour/services/tour-services';
import { TourMain } from '@/views/tour/ui/tour-main';

export const TourView: FC<ServerTourProps> = async ({ params }) => {
  const { slug } = await params;
  const either = await tourServices.getTourBySlug(slug);

  // Тура с таким slug нет (или он не одобрен) — это 404, а не ошибка
  // загрузки. Раньше страница отдавала 200 и голую строку «Ошибка при
  // загрузке страницы», и такие адреса индексировались как настоящие
  // страницы. Ровно так же уже исправлена страница поста.
  if (either.type === 'left') {
    notFound();
  }

  return <TourMain {...either.value} />;
};
