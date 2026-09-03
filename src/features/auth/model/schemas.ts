import { z } from 'zod';

export const emailSchema = z.email();

export const formDataSchema = z.object({
  login: emailSchema,
  password: z.string().min(3),
  tel: z
    .string()
    .regex(
      /^(?:\+7|7|8)[ -]?\(?(?:9\d{2})\)?(?:[ -]?\d){7}$/,
      'Неверный формат телефона'
    ),
  code: z.string().min(3)
});

export type SignUpData = z.infer<typeof formDataSchema>;
