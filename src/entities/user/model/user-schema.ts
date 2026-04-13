import z from 'zod';

export const userSchema = z.object({
  id: z.number(),
  login: z.string(),
  passwordHash: z.string(),
  phone: z.string(),
  salt: z.string(),
  role: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatarPhotoId: z.number().optional(),
  email: z.string().optional(),
  rating: z.number().optional()
});
