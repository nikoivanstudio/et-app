'use server';

import { FC } from 'react';

import { guideServices } from '@/kernel/guide/server';
import { GuideMain } from '@/views/guide/ui/guide-main';

type Props = {
  params: Promise<{ slug: string }>;
};

export const GuideView: FC<Props> = async ({ params }) => {
  const { slug } = await params;
  const either = await guideServices.getGuideBySlug(slug);

  return (
    <>
      {either.type === 'right' ? (
        <GuideMain {...either.value} />
      ) : (
        <div className='flex items-center justify-center py-20'>
          Гид не найден
        </div>
      )}
    </>
  );
};
