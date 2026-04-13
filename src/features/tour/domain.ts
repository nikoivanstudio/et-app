import { PhotoEntity } from '@/widgets/tours/domain';

import { TourDomain } from '@/entities/tour/server';

export type TourCardEntity = {
  id: number;
  title: string;
  price: number;
  rating: number | null;
  duration: number | null;
  mainPhoto: string;
  slug: string;
};

export type DraftCreateTourData = {
  title: string;
  description: string;
  mainPhoto: File[];
  content: string;
  price: number;
  slug: string;
  duration: number;
  categories: string[];
  status: string;
  photos?: File[];
  descriptionText?: string;
  startPlace?: string;
};

export type CreateTourData = Omit<
  DraftCreateTourData,
  'mainPhoto' | 'photos'
> & {
  mainPhoto: File;
  photos?: File[];
};

export type EditTourData = Partial<CreateTourData> & {
  id: number;
  authorId: number;
  mainPhoto?: Omit<PhotoEntity, 'id'>;
  photos?: Omit<PhotoEntity, 'id'>[];
};

export type GetToursResponse = {
  pagesCount: number;
  tours: TourDomain.TourEntity[];
};
