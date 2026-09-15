'use client';

import { FC } from 'react';

import { useChatThread, useSendMessage } from '../hooks/use-chat';
import { ChatThread } from '../ui/chat-thread';

type Props = { bookingId: number; enabled?: boolean };

/** Переписка в кабинете гида: заявка своя, вход по сессии. */
export const GuideChat: FC<Props> = ({ bookingId, enabled = true }) => {
  const target = { bookingId };
  const { thread, isLoading, error } = useChatThread(target, enabled);
  const { send, isPending, error: sendError } = useSendMessage(target);

  return (
    <ChatThread
      thread={thread}
      isLoading={isLoading}
      isSending={isPending}
      error={sendError?.message ?? error?.message ?? null}
      variant='dark'
      onSend={send}
    />
  );
};
