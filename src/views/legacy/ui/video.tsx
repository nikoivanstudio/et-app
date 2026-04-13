'use server';

import { FC } from 'react';

import { cn } from '@/shared/lib/css';

const videoId = 'L-fT3LfelLY';

export const Video: FC = async () => (
  <div
    className={cn('my-1')}
    style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}
  >
    <iframe
      className={cn('rounded-4xl')}
      src={`https://www.youtube.com/embed/${videoId}`}
      title='YouTube video player'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      allowFullScreen
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
    />
  </div>
);
