import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { partnerApplicationApi } from '../api/partner-application-api';
import { ReviewApplicationPayload } from '../model/schemas';

type HookProps = {
  onSuccess?: () => void;
};

export const useReviewApplication = ({ onSuccess }: HookProps = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, Error, ReviewApplicationPayload>({
    mutationFn: partnerApplicationApi.reviewApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [partnerApplicationApi.baseKey]
      });
      toast.success('Заявка обработана');
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
