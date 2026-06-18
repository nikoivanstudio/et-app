import { TourStatus } from '@/entities/tour/domain';

import { Prisma } from '../../../../generated/prisma/client';
import TourWhereInput = Prisma.TourWhereInput;

const getValidStatus = (value: string | null): TourStatus =>
  value && value in TourStatus
    ? (value as TourStatus)
    : TourStatus.APPROVED;

const getSearchParamsUtils = (
  searchQuery: string | null
): { where: TourWhereInput } | undefined => {
  if (!searchQuery) {
    return;
  }

  return {
    where: {
      OR: [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { metaTitle: { contains: searchQuery, mode: 'insensitive' } },
        { metaDescription: { contains: searchQuery, mode: 'insensitive' } }
      ]
    }
  };
};

export const tourSearchUtils = { getValidStatus, getSearchParamsUtils };
