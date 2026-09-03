import z from 'zod';

export const otpCreateSchema = z.object({
  email: z.email(),
  tel: z
    .string()
    .regex(
      /^(?:\+7|7|8)[ -]?\(?(?:9\d{2})\)?(?:[ -]?\d){7}$/,
      'Неверный формат телефона'
    )
});
