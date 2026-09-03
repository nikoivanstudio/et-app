'use server';

import { notFound } from 'next/navigation';
import { FC } from 'react';

import { guideServices } from '@/kernel/guide/server';
import { GuideMain } from '@/views/guide/ui/guide-main';

type Props = {
  params: Promise<{ slug: string }>;
};

export const GuideView: FC<Props> = async ({ params }) => {
  const { slug } = await params;
  const either = await guideServices.getGuideBySlug(slug);

  // Гида нет — 404, а не 200 с текстом «Гид не найден»: мягкие 404
  // попадают в индекс как полноценные страницы.
  if (either.type === 'left') {
    notFound();
  }

  return <GuideMain {...either.value} />;
};
