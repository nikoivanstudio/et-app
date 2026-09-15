import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { bookingApi } from '@/features/booking/api/booking-api';

import { MessageDomain } from '@/entities/message';

import { chatApi, ThreadTarget } from '../api/chat-api';

export const useChatThread = (target: ThreadTarget, enabled = true) => {
  const { data, isLoading, error } = useQuery(
    chatApi.getThreadQueryOption(target, enabled)
  );

  return { thread: data, isLoading, error };
};

export const useSendMessage = (target: ThreadTarget) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<MessageDomain.ChatMessage, Error, string>({
    mutationFn: text => chatApi.sendMessage({ ...target, text }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [chatApi.baseKey, target.token ?? target.bookingId]
      });
      // Счётчик непрочитанного живёт в списке заявок.
      queryClient.invalidateQueries({ queryKey: [bookingApi.baseKey] });
    }
  });

  return {
    send: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset
  };
};
