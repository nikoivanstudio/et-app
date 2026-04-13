import { createTourSchemas } from '@/features/tour';
import { DraftCreateTourData } from '@/features/tour/domain';

export const isCreateTourData = (
  value: unknown
): value is DraftCreateTourData => {
  return createTourSchemas.safeParse(value).success;
};
