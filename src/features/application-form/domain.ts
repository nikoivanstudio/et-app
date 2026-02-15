import { applicationFormSchema } from '@/features/application-form/model/schema';
import z from 'zod';

export type ApplicationData = {
  entityName: string;
  entityId: string;
  entityType: 'tour' | 'activity';
};

export type Props = {
  appData?: ApplicationData;
};

export type CallbackData = z.infer<typeof applicationFormSchema>;
