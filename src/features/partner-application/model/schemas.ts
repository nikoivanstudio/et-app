import { z } from 'zod';

import { PartnerApplicationDomain } from '@/entities/partner-application';

export const createApplicationSchema = z.object({
  type: z.nativeEnum(PartnerApplicationDomain.PartnerApplicationType, {
    errorMap: () => ({ message: 'Выберите тип партнёрства' })
  }),
  agreement: z
    .union([z.literal('on'), z.literal('true'), z.boolean()])
    .refine(value => value === 'on' || value === 'true' || value === true, {
      message: 'Необходимо подтвердить согласие'
    })
});

export const reviewApplicationSchema = z.object({
  id: z.number(),
  status: z.enum([
    PartnerApplicationDomain.PartnerApplicationStatus.APPROVED,
    PartnerApplicationDomain.PartnerApplicationStatus.REJECTED
  ]),
  comment: z.string().optional()
});

export type ReviewApplicationPayload = z.infer<typeof reviewApplicationSchema>;
