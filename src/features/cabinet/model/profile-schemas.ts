import { z } from 'zod';

const trimmed = (max: number) => z.string().trim().max(max);

/**
 * Профиль гида — то, что клиент видит до заявки.
 *
 * Роль, логин и телефон сюда не входят: телефон меняется только через код
 * подтверждения, а роль — вообще не дело самого гида.
 */
export const guideProfileSchema = z.object({
  firstName: trimmed(60).default(''),
  lastName: trimmed(60).default(''),
  headline: trimmed(160).default(''),
  bio: trimmed(2000).default(''),
  // Слаг города из справочника, а не набранное название: по городу гид
  // попадает в подборки региона, и опечатка в нём ничего не ломает
  // видимо — просто оставляет гида вне подборки.
  citySlug: trimmed(120).default(''),
  vehicle: trimmed(200).default(''),
  email: z.email('Неверный email').or(z.literal('')).default(''),
  languages: z.array(trimmed(60).min(1)).max(10).default([]),
  specializations: z.array(trimmed(60).min(1)).max(12).default([]),
  experienceSince: z
    .number()
    .int()
    .min(1970)
    .max(new Date().getFullYear())
    .nullable()
    .default(null),
  notifyNewBooking: z.boolean().default(true),
  notifyNewMessage: z.boolean().default(true),
  notifyTripReminder: z.boolean().default(true),
  notifyNews: z.boolean().default(false)
});

export type GuideProfilePayload = z.infer<typeof guideProfileSchema>;
