'use server';

import { Metadata } from 'next';

import { Either } from '@/shared/lib/either';
import {
  buildNoindexMetadata,
  buildPageMetadata
} from '@/shared/lib/seo/page-metadata';
import { PageMetaData } from '@/shared/model/types';

/**
 * Метаданные динамической страницы (пост, тур, гид) по результату выборки.
 *
 * `path` — канонический адрес страницы. Обязателен: без него страница
 * унаследовала бы canonical родителя и объявила себя копией чужой страницы.
 */
export async function getMetadataByEither(
  either: Either<string, PageMetaData>,
  path: string
): Promise<Metadata> {
  // Записи нет — страница отдаёт notFound(), и метаданные нужны, чтобы адрес
  // не попал в индекс. Раньше тут стояли заглушки «Заголовок страницы» и
  // «Описание», из-за которых битые адреса выглядели как настоящие страницы.
  //
  // Именно noindex, а не только notFound(), решает задачу до конца: статус
  // такого ответа сейчас всё равно 200 — корневой src/app/loading.tsx
  // открывает Suspense-границу, и оболочка ответа уходит раньше, чем
  // страница успевает отказаться. Пока loading.tsx на месте, noindex —
  // единственное, что гарантированно держит битые адреса вне индекса.
  if (either.type === 'left') {
    return buildNoindexMetadata('Страница не найдена');
  }

  return buildPageMetadata({
    title: either.value.title,
    description: either.value.description,
    keywords: either.value.keywords,
    path
  });
}
