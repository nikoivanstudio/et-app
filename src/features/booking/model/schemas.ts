import { z } from 'zod';

// Тот же формат телефона, что и в auth-схемах приложения.
const phoneRegex = /^(?:\+7|7|8)[ -]?\(?(?:9\d{2})\)?(?:[ -]?\d){7}$/;

export const createBookingSchema = z.object({
  tourId: z.number().int().positive(),
  name: z.string().trim().min(2, 'Укажите имя').max(120),
  phone: z.string().regex(phoneRegex, 'Неверный формат телефона'),
  email: z.email('Неверный email').optional().or(z.literal('')),
  desiredDate: z.string().optional(),
  peopleCount: z.number().int().min(1).max(100).default(1),
  comment: z.string().max(1000).optional(),
  agreement: z
    .union([z.literal('on'), z.literal('true'), z.boolean()])
    .refine(value => value === 'on' || value === 'true' || value === true, {
      message: 'Необходимо подтвердить согласие'
    }),
  // Honeypot: реальные пользователи это поле не заполняют (проверяем в роуте).
  company: z.string().optional()
});

export type CreateBookingPayload = z.infer<typeof createBookingSchema>;

export const updateBookingSchema = z.object({
  id: z.number().int().positive(),
  action: z.enum([
    'contact',
    'confirm',
    'reschedule',
    'cancel',
    'complete',
    'spam',
    'note'
  ]),
  reason: z.string().max(500).optional(),
  note: z.string().max(1000).optional(),
  desiredDate: z.string().optional()
});

export type UpdateBookingPayload = z.infer<typeof updateBookingSchema>;
