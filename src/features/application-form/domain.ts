import z from 'zod';

import { applicationFormSchema } from '@/features/application-form/model/schema';

export type ApplicationData = {
  /** Название страницы или тура — попадает в письмо оператору. */
  entityName: string;
  entityId: string;
  /**
   * `page` добавлен в A7: форма встала на легаси-страницы туров, страницы
   * объектов и в каталог, а там нет ни тура, ни выезда — есть страница,
   * с которой пришла заявка. Без этого значения источник заявки в письме
   * не отличить, а именно эти страницы и стоят в индексе.
   */
  entityType: 'tour' | 'activity' | 'page';
};

export type Props = {
  appData?: ApplicationData;
};

export type CallbackData = z.infer<typeof applicationFormSchema>;
