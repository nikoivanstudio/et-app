import { FC, PropsWithChildren } from 'react';

import { GeoPointLayout, GeoPointProps } from '@/entities/geo-point/ui/layout';

import { PropsWithClassNames } from '@/shared/model/types';

export const GeoPoint: FC<
  PropsWithChildren<GeoPointProps> & PropsWithClassNames
> = ({ ...props }) => <GeoPointLayout {...props} />;
