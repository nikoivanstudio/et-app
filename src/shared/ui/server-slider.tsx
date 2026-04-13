'use server';

import { FC, ReactNode } from 'react';

import { SliderControls } from '@/shared/ui/slider-controls';

type Props = {
  title: ReactNode;
  slides: ReactNode[];
  rounded?: boolean;
};

export const ServerSlider: FC<Props> = async ({ title, slides, rounded }) => (
  <section className='flex flex-col items-center gap-6 py-8'>
    <h2 className='text-2xl font-bold text-center bg-zinc-500 text-white px-6 py-2 rounded-xl'>
      {title}
    </h2>
    <SliderControls rounded={rounded}>
      {slides.map((slide, idx) => (
        <div key={idx} className='flex-[0_0_100%] flex-[0_0_33.33%]'>
          {slide}
        </div>
      ))}
    </SliderControls>
  </section>
);
