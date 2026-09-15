import { z } from 'zod';

import { TourStatus } from '@/entities/tour/domain';

/** Варианты билетов: подпись, за что цена, длительность и сумма. */
export const priceOptionSchema = z.object({
  label: z.string().trim().min(2, 'Слишком короткое название').max(120),
  unit: z.enum(['PER_CAR', 'PER_PERSON']),
  durationHours: z.number().int().min(1).max(24),
  price: z.number().int().min(0).max(1_000_000)
});

export const faqItemSchema = z.object({
  question: z.string().trim().min(3).max(200),
  answer: z.string().trim().min(3).max(1000)
});

export const routeStopSchema = z.object({
  title: z.string().trim().min(2).max(200),
  sub: z.string().trim().max(300).optional()
});

const list = (max: number, itemMax = 200) =>
  z.array(z.string().trim().min(1).max(itemMax)).max(max).default([]);

/**
 * Черновик тура.
 *
 * Почти всё необязательное: редактор сохраняет черновик на каждом шаге, и
 * требовать заполненную цену на шаге «Основное» бессмысленно. Обязательность
 * проверяется один раз — при отправке на модерацию (см. `checklist.ts`).
 */
export const tourDraftSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, 'Название тура короче 10 символов')
    .max(180, 'Название тура длиннее 180 символов'),
  about: z.string().trim().max(512).default(''),
  description: z.string().trim().max(20_000).default(''),
  startCitySlug: z.string().trim().max(120).default(''),
  durationHours: z.number().int().min(1).max(24).default(1),
  capacity: z.number().int().min(1).max(100).nullable().default(null),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).nullable().default(null),
  price: z.number().int().min(0).max(1_000_000).default(0),
  priceUnit: z.enum(['PER_CAR', 'PER_PERSON']).default('PER_CAR'),
  seasons: z.array(z.number().int().min(1).max(12)).max(12).default([]),
  categories: list(12, 60),
  included: list(30),
  excluded: list(30),
  faq: z.array(faqItemSchema).max(20).default([]),
  routeStops: z.array(routeStopSchema).max(30).default([]),
  priceOptions: z.array(priceOptionSchema).max(10).default([]),
  minGroupSize: z.number().int().min(1).max(100).nullable().default(null),
  bookingLeadDays: z.number().int().min(0).max(60).nullable().default(null),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Время в формате 08:00')
    .or(z.literal(''))
    .default(''),
  weekdays: z.array(z.number().int().min(1).max(7)).max(7).default([]),
  blockedDates: z.array(z.string()).max(365).default([]),
  meetingAddress: z.string().trim().max(300).default(''),
  meetingNote: z.string().trim().max(1000).default(''),
  pickupCitySlugs: list(20, 120),
  metaTitle: z.string().trim().max(180).default(''),
  metaDescription: z.string().trim().max(400).default('')
});

export type TourDraftPayload = z.infer<typeof tourDraftSchema>;

export const saveTourSchema = tourDraftSchema.extend({
  /** Нет id — создаём черновик, есть — обновляем существующий тур. */
  id: z.number().int().positive().optional()
});

export type SaveTourPayload = z.infer<typeof saveTourSchema>;

/**
 * Смена видимости тура руками гида.
 *
 * `PENDING` — отправить на проверку, пустой статус — снять с публикации
 * (черновик публично не виден, PUBLIC_TOUR_STATUS = APPROVED).
 */
export const setTourStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.literal([TourStatus.PENDING, 'DRAFT'])
});

export type SetTourStatusPayload = z.infer<typeof setTourStatusSchema>;
