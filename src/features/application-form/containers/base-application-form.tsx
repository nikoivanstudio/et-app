'use client';

import { FC } from 'react';

import { Props } from '@/features/application-form/domain';
import { ApplicationFormLayout } from '@/features/application-form/ui/layout';

export const BaseApplicationForm: FC<Props> = props => (
  <ApplicationFormLayout {...props} />
);
