'use server';

import { FC } from 'react';

import { ServerTourProps } from '@/shared/model/types';

import { TourView } from '@/views/tour/server';

const TourPage: FC<ServerTourProps> = async props => <TourView {...props} />;

export default TourPage;
