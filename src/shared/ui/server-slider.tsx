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
    {/* Было: серая плашка bg-zinc-500 с белым текстом — последний осколок
        старого языка, к палитре v2 отношения не имеющий. */}
    <h2 className='font-poiret text-ink mx-auto max-w-[1120px] px-4 text-center text-2xl'>
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
