'use server';

import { FC } from 'react';

import { DurationLabelProps } from '@/entities/duration/model/types';
import { DurationLabelLayout } from '@/entities/duration/ui/duration-label-layout';

export const ServerDurationLabel: FC<DurationLabelProps> = async props => (
  <DurationLabelLayout {...props} />
);
