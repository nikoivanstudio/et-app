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
  // Раньше такой ответ приходил со статусом 200: loading.tsx над страницей
  // открывал Suspense-границу, и заголовки ответа уходили раньше, чем
  // страница успевала отказаться, — а после начала стрима статус не
  // поменять (docs: 01-app/03-api-reference/03-file-conventions/loading.md,
  // раздел «Status Codes»). loading.tsx с динамических сегментов снят,
  // и статус теперь настоящий 404. noindex остаётся страховкой: если
  // Suspense-граница появится выше по дереву снова, битый адрес всё равно
  // не попадёт в индекс.
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
