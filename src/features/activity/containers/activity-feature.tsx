'use client';

import { FC } from 'react';

import { ActivityCard } from '@/features/activity';

import { ActivityDomain } from '@/entities/activity/server';

import { FeatureLayout } from '@/shared/ui/feature-layout';

export const ActivityFeature: FC<ActivityDomain.ActivityEntity> = props => (
  <FeatureLayout title={props.title || 'Название мероприятия'}>
    <ActivityCard {...props} />
  </FeatureLayout>
);
