import { removeEmptyProperties } from '@/shared/lib/object-utils';

import { Activity } from '../../../../generated/prisma/client';

const getSafeActivityEntity = (activity: Activity): Activity => {
  return removeEmptyProperties<Activity>(activity);
};

export const secureUtils = { getSafeActivityEntity };
