import z from 'zod';

import { Role } from '@/entities/user/domain';

const optionalString = z.string().optional().or(z.literal(''));

export const editUserSchema = z.object({
  id: z.number(),
  login: z.string().min(1, 'Логин обязателен'),
  phone: z.string().min(1, 'Телефон обязателен'),
  role: z.nativeEnum(Role),
  firstName: optionalString,
  lastName: optionalString,
  email: optionalString,
  avatarPhotoId: z.number().optional(),
  rating: z.number().optional()
});
