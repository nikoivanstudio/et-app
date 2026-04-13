'use server';

import { FC, ReactNode } from 'react';

import { LegacyTourCardData } from '@/shared/model/types';
import { LegacyTourCard } from '@/shared/ui/legacy-tour-card';
import { ServerSlider } from '@/shared/ui/server-slider';

type Props = { tours: LegacyTourCardData[]; title: ReactNode };

export const Slider: FC<Props> = async ({ tours, title }) => {
  const slides = tours.map((tour, idx) => (
    <LegacyTourCard tour={tour} key={idx} />
  ));

  return <ServerSlider title={title} slides={slides} rounded={true} />;
};
