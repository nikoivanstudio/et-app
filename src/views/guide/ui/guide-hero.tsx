import Image from 'next/image';
import { FC } from 'react';

import { GuideAvatar } from '@/entities/guide';

import styles from '@/shared/assets/styles.module.scss';
import { cn } from '@/shared/lib/css';

type Props = {
  name: string;
  headline?: string;
  avatarPhoto?: string;
  coverPhoto?: string;
  verified: boolean;
};

export const GuideHero: FC<Props> = ({
  name,
  headline,
  avatarPhoto,
  coverPhoto,
  verified
}) => (
  <section className='relative h-[58vh] min-h-[360px] w-full overflow-hidden'>
    {coverPhoto ? (
      <Image
        src={coverPhoto}
        alt={name}
        fill
        priority
        className='object-cover object-center'
      />
    ) : (
      <div
        className='absolute inset-0'
        style={{
          background: 'linear-gradient(135deg, #CAA66A 0%, #9C7A44 40%, #5F4A2A 100%)'
        }}
      />
    )}

    <div
      className='absolute inset-0'
      style={{
        background:
          'linear-gradient(180deg, rgba(20,16,10,0.12) 0%, rgba(20,16,10,0.55) 68%, rgba(20,16,10,0.9) 100%)'
      }}
    />

    <div className='absolute inset-x-0 bottom-[7vh] z-2 flex flex-col items-center px-4 text-center text-white'>
      <GuideAvatar
        src={avatarPhoto}
        name={name}
        size={92}
        ring={3}
        verified={verified}
      />
      <h1
        className={cn(
          styles.poiret_text_white,
          'mt-3 text-[27px] leading-tight'
        )}
      >
        {name}
      </h1>
      {!!headline && (
        <p className='mt-1.5 text-sm tracking-wide text-white/90'>{headline}</p>
      )}
    </div>
  </section>
);
