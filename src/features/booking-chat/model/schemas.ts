import { z } from 'zod';

import { MessageDomain } from '@/entities/message';

/**
 * Клиент входит в переписку по токену заявки (аккаунт для этого не нужен —
 * заявку можно оставить без регистрации), гид — по номеру заявки и сессии.
 */
const threadTargetSchema = z.object({
  token: z.string().min(8).optional(),
  bookingId: z.number().int().positive().optional()
});

export const getThreadSchema = threadTargetSchema;

export const sendMessageSchema = threadTargetSchema.extend({
  text: z
    .string()
    .trim()
    .min(1, 'Сообщение пустое')
    .max(
      MessageDomain.MESSAGE_MAX_LENGTH,
      `Сообщение длиннее ${MessageDomain.MESSAGE_MAX_LENGTH} символов`
    )
});

export type GetThreadPayload = z.infer<typeof getThreadSchema>;
export type SendMessagePayload = z.infer<typeof sendMessageSchema>;
