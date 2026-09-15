'use client';

import { FC } from 'react';

import { useChatThread, useSendMessage } from '../hooks/use-chat';
import { ChatThread } from '../ui/chat-thread';

type Props = { token: string };

/** Переписка на публичной странице заявки: клиент входит по ссылке-токену. */
export const BookingChat: FC<Props> = ({ token }) => {
  const target = { token };
  const { thread, isLoading, error } = useChatThread(target);
  const { send, isPending, error: sendError } = useSendMessage(target);

  return (
    <ChatThread
      thread={thread}
      isLoading={isLoading}
      isSending={isPending}
      error={sendError?.message ?? error?.message ?? null}
      variant='light'
      onSend={send}
    />
  );
};
