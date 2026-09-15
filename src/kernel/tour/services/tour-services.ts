import { PUBLIC_TOUR_STATUS } from '@/entities/tour/domain';

import { Either, left, right } from '@/shared/lib/either';
import { buildDescription } from '@/shared/lib/seo/description';
import { PageMetaData } from '@/shared/model/types';

import { TourKernel, tourToKernelTour } from '@/kernel/tour/domain';
import { TourWR } from '@/kernel/tour/model/types';
import { tourRepository } from '@/kernel/tour/repositories/tour';

async function getTourBySlug(
  slug: string
): Promise<Either<string, TourKernel>> {
  const tour = await tourRepository.getTour({
    where: { slug, status: PUBLIC_TOUR_STATUS },
    include: {
      reviews: true,
      photos: true,
      activities: true
    }
  });

  if (!tour) {
    return left('Тур с указанным слоганом не найден');
  }

  return right(tourToKernelTour(tour as TourWR));
}

async function getTourMetaData(
  slug: string
): Promise<Either<string, PageMetaData>> {
  const tour = await tourRepository.getTour<{
    select: {
      title: true;
      description: true;
      descriptionText: true;
      metaTitle: true;
      metaDescription: true;
      metaKeywords: true;
    };
  }>({ where: { slug, status: PUBLIC_TOUR_STATUS } });

  if (!tour) {
    return left('Тур с указанным слоганом не найден');
  }

  // Тот же фолбэк, что и у постов: заполненное описание → текст тура →
  // пусто. Заглушки из импорта сюда не доезжали, но правило про описание
  // на сайте должно быть одно, а не два.
  return right({
    title: tour.metaTitle || tour.title,
    description: buildDescription(
      tour.metaDescription || tour.description,
      tour.descriptionText
    ),
    keywords: tour.metaKeywords
  });
}

export const tourServices = { getTourBySlug, getTourMetaData };
