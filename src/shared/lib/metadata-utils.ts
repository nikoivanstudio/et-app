'use server';

import { Metadata } from 'next';

import { Either } from '@/shared/lib/either';
import { PageMetaData } from '@/shared/model/types';

export async function getMetadataByEither(
  either: Either<string, PageMetaData>
): Promise<Metadata> {
  if (either.type === 'left') {
    return {
      title: `Заголовок страницы`,
      description: `Описание`
    };
  }

  return {
    title: either.value.title,
    description: either.value.description,
    keywords: either.value.keywords
  };
}
