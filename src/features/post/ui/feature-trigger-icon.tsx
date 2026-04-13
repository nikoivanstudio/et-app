import { UserPen } from 'lucide-react';
import { FC } from 'react';

import { FeatureTypes } from '@/features/post/domain';

export const FeatureTriggerIcon: FC<{ type: FeatureTypes }> = ({ type }) => (
  <>{type === 'edit' ? <UserPen className='size-4' /> : 'Создать пост'}</>
);
