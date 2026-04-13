'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FC, PropsWithChildren, useEffect } from 'react';

import { Button } from '@/shared/ui/button';

export const SliderControls: FC<PropsWithChildren & { rounded?: boolean }> = ({
  children,
  rounded
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    const viewport: HTMLElement | null = document.querySelector('#embla');

    if (viewport && emblaRef) emblaRef(viewport);
  }, [emblaRef]);

  return (
    <div
      className={`relative max-w-full w-full overflow-hidden${rounded ? ' rounded-xl' : ''}`}
    >
      <div className='overflow-hidden' ref={emblaRef}>
        <div className='flex'>{children}</div>
      </div>

      <Button
        onClick={() => {
          emblaApi?.scrollPrev();
        }}
        className='absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/60 backdrop-blur accent-zinc-200'
      >
        <ChevronLeft />
      </Button>

      <Button
        onClick={() => emblaApi?.scrollNext()}
        className='absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/60 backdrop-blur accent-zinc-200'
      >
        <ChevronRight />
      </Button>
    </div>
  );
};
