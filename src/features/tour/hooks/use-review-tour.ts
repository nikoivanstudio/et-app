import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { tourApi } from '@/features/tour/api/tour-api';
import { tourModerationApi } from '@/features/tour/api/tour-moderation-api';
import { ReviewTourPayload } from '@/features/tour/lib/schemas/create-tour-schemas';

type HookProps = {
  onSuccess?: () => void;
};

export const useReviewTour = ({ onSuccess }: HookProps = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, Error, ReviewTourPayload>({
    mutationFn: tourModerationApi.reviewTour,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [tourModerationApi.baseKey]
      });
      // Одобренный тур уходит в общий каталог — обновляем и его кэш.
      queryClient.invalidateQueries({ queryKey: [tourApi.baseKey] });
      toast.success('Тур обработан');
      onSuccess?.();
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  return {
    review: mutation.mutate,
    isPending: mutation.isPending
  };
};
