'use server';

import { FC } from 'react';

import { ServerTourProps } from '@/shared/model/types';

import { tourServices } from '@/kernel/tour/services/tour-services';
import { TourMain } from '@/views/tour/ui/tour-main';

export const TourView: FC<ServerTourProps> = async ({ params }) => {
  const { slug } = await params;
  const either = await tourServices.getTourBySlug(slug);

  return (
    <>
      {either.type === 'right' ? (
        <TourMain {...either.value} />
      ) : (
        <div className='flex justify-center items-center'>
          Ошибка при загрузке страницы... попробуйте вновь
        </div>
      )}
    </>
  );
};
