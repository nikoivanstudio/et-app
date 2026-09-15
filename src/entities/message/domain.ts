/** Кто написал сообщение: обе стороны переписки по заявке. */
export enum MessageAuthorRole {
  CLIENT = 'CLIENT',
  GUIDE = 'GUIDE'
}

/** Столько же стоит в схеме БД (`message.text`). */
export const MESSAGE_MAX_LENGTH = 2000;

/** Сообщение в виде, пригодном для UI: дата уже строкой после JSON. */
export type ChatMessage = {
  id: number;
  authorRole: string;
  authorName: string;
  text: string;
  createdAt: string;
  readAt: string | null;
};

export type ChatThread = {
  bookingId: number;
  tourTitle: string;
  tourSlug: string;
  companionName: string;
  /** Роль того, кто смотрит: по ней сообщение рисуется своим или чужим. */
  viewerRole: string;
  /** Можно ли писать: в отклонённой и просроченной заявке переписка закрыта. */
  canWrite: boolean;
  messages: ChatMessage[];
};

/**
 * Текст отказа, когда в сообщении нашёлся номер. Лежит в домене, а не
 * в роуте: его показывает и форма отправки, и тест.
 */
export const PHONE_IN_MESSAGE_ERROR =
  'В переписке нельзя обмениваться телефонами. Гид свяжется с вами по номеру из заявки';
