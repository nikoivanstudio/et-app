'use client';

import { FC } from 'react';

import { DurationLabelProps } from '@/entities/duration/model/types';
import { DurationLabelLayout } from '@/entities/duration/ui/duration-label-layout';

export const ClientDurationLabel: FC<DurationLabelProps> = props => (
  <DurationLabelLayout {...props} />
);
