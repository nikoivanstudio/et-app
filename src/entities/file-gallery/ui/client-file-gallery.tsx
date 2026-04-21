'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

import { GallerySlide } from '@/entities/file-gallery/domain';

import { cn } from '@/shared/lib/css';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';

type Props = {
  slides: GallerySlide[];
  title?: string;
  showAllLabel?: string;
};

export const ClientFileGallery: FC<Props> = ({
  slides,
  title = 'Фотографии',
  showAllLabel = 'Смотреть все фотографии'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: slides.length > 1,
    startIndex: 0
  });

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const syncIndex = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };

    syncIndex();
    emblaApi.on('select', syncIndex);

    return () => {
      emblaApi.off('select', syncIndex);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!isOpen || !emblaApi) {
      return;
    }

    emblaApi.reInit({ loop: slides.length > 1, startIndex: currentIndex });
    emblaApi.scrollTo(currentIndex, true);
  }, [currentIndex, emblaApi, isOpen, slides.length]);

  useEffect(() => {
    if (!isOpen || slides.length < 2) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        emblaApi?.scrollPrev();
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        emblaApi?.scrollNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [emblaApi, isOpen, slides.length]);

  const openAt = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const previewSlides = slides.slice(0, 3);
  const hiddenSlidesCount = Math.max(slides.length - previewSlides.length, 0);

  return (
    <>
      <section className='w-full p-3'>
        <div className='w-full overflow-hidden'>
          <div className='relative h-32 w-full sm:h-36'>
            {previewSlides.map((slide, index) => {
              const isLastPreview = index === previewSlides.length - 1;

              return (
                <button
                  key={slide.id}
                  type='button'
                  onClick={() => openAt(index)}
                  className={cn(
                    'group absolute inset-y-0 text-left',
                    index === 0 ? 'left-0 z-10 w-[46%]' : '',
                    index === 1 ? 'left-[27%] z-20 w-[46%]' : '',
                    index === 2 ? 'left-[54%] z-30 w-[46%]' : ''
                  )}
                  aria-label={`Открыть фотографию ${index + 1}`}
                >
                  <div className='relative h-full overflow-hidden rounded-[24px] border-2 border-white bg-zinc-200 shadow-sm'>
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      sizes='(max-width: 768px) 40vw, 28vw'
                      className='object-cover transition-transform duration-300 group-hover:scale-[1.02]'
                    />
                    <div className='absolute inset-0 bg-black/20' />
                    {index === 0 ? (
                      <div className='absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs text-white backdrop-blur-sm'>
                        {slides.length} фото
                      </div>
                    ) : null}
                    {isLastPreview && hiddenSlidesCount > 0 ? (
                      <div className='absolute inset-0 flex items-center justify-center bg-black/45 text-lg font-medium text-white backdrop-blur-[2px]'>
                        +{hiddenSlidesCount}
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className='mt-3 flex justify-end'>
          <Button
            type='button'
            variant='ghost'
            onClick={() => openAt(0)}
            className='h-auto rounded-full px-4 py-2 text-sm tracking-wide text-[#41503F]'
          >
            <Expand className='size-4' />
            {showAllLabel}
          </Button>
        </div>
      </section>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          showCloseButton={false}
          className='top-1/2 left-1/2 h-screen w-screen max-w-none translate-x-[-50%] translate-y-[-50%] rounded-none border-0 bg-black/95 p-0 shadow-none'
        >
          <DialogTitle className='sr-only'>{title}</DialogTitle>

          <div className='relative flex h-full flex-col'>
            <div className='absolute top-4 left-4 z-20 rounded-full bg-black/45 px-3 py-1 text-sm text-white backdrop-blur-sm'>
              {currentIndex + 1} / {slides.length}
            </div>

            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => setIsOpen(false)}
              className='absolute top-4 right-4 z-20 rounded-full bg-black/45 text-white hover:bg-black/60 hover:text-white'
              aria-label='Закрыть галерею'
            >
              <X className='size-5' />
            </Button>

            <div className='relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-16'>
              <div className='h-full w-full overflow-hidden' ref={emblaRef}>
                <div className='flex h-full'>
                  {slides.map(slide => (
                    <div
                      key={slide.id}
                      className='relative min-h-0 min-w-0 flex-[0_0_100%]'
                    >
                      <div className='relative h-full w-full'>
                        <Image
                          src={slide.src}
                          alt={slide.alt}
                          fill
                          sizes='100vw'
                          className='object-contain'
                          priority
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {slides.length > 1 ? (
                <>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => emblaApi?.scrollPrev()}
                    className='absolute left-3 rounded-full bg-black/45 text-white hover:bg-black/60 hover:text-white md:left-5'
                    aria-label='Предыдущая фотография'
                  >
                    <ChevronLeft className='size-6' />
                  </Button>

                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => emblaApi?.scrollNext()}
                    className='absolute right-3 rounded-full bg-black/45 text-white hover:bg-black/60 hover:text-white md:right-5'
                    aria-label='Следующая фотография'
                  >
                    <ChevronRight className='size-6' />
                  </Button>
                </>
              ) : null}
            </div>

            <div className='overflow-x-auto px-4 pb-4 md:px-8 md:pb-6'>
              <div className='mx-auto flex w-max gap-2'>
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type='button'
                    onClick={() => {
                      setCurrentIndex(index);
                      emblaApi?.scrollTo(index);
                    }}
                    className={cn(
                      'relative h-18 w-24 overflow-hidden rounded-2xl border transition-opacity',
                      index === currentIndex
                        ? 'border-white opacity-100'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    )}
                    aria-label={`Перейти к фотографии ${index + 1}`}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      sizes='96px'
                      className='object-cover'
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
