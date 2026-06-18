import { useQuery } from '@tanstack/react-query';

import { tourModerationApi } from '@/features/tour/api/tour-moderation-api';
import { GetPendingToursResponse } from '@/features/tour/domain';

export const usePendingTours = () => {
  const { data, isLoading, isFetching, error } = useQuery({
    ...tourModerationApi.getPendingToursQueryOption<GetPendingToursResponse>()
  });

  return { data, isLoading, isFetching, error };
};
