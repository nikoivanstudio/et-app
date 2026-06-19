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
  rating: z.number().optional(),
  slug: z.string().optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  coverPhotoId: z.number().optional(),
  languages: z.array(z.string()).optional(),
  specializations: z.array(z.string()).optional(),
  experienceSince: z.number().optional()
});
