import Image from 'next/image';
import { FC } from 'react';

import { cn } from '@/shared/lib/css';
import { PropsWithClassNames } from '@/shared/model/types';

type Props = {
  src?: string;
  name: string;
  size?: number;
  /** Толщина золотого кольца вокруг аватара, px. 0 — без кольца. */
  ring?: number;
  verified?: boolean;
} & PropsWithClassNames;

const getInitials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');

export const GuideAvatar: FC<Props> = ({
  src,
  name,
  size = 58,
  ring = 2,
  verified = false,
  className
}) => {
  const badgeSize = Math.round(size * 0.34);

  return (
    <span
      className={cn('relative inline-block shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <span
        className='block h-full w-full overflow-hidden rounded-full'
        style={
          ring
            ? {
                boxShadow: `0 0 0 2px #FFFFFF, 0 0 0 ${2 + ring}px #B8915A`
              }
            : undefined
        }
      >
        {src ? (
          <Image
            src={src}
            alt={name}
            width={size}
            height={size}
            className='h-full w-full object-cover'
          />
        ) : (
          <span
            className='flex h-full w-full items-center justify-center font-semibold text-white'
            style={{
              background: 'linear-gradient(135deg, #CAA66A, #7D6234)',
              fontSize: size * 0.36
            }}
          >
            {getInitials(name)}
          </span>
        )}
      </span>

      {verified && (
        <span
          className='absolute -bottom-0.5 -right-0.5 grid place-items-center rounded-full bg-[#B8915A] text-white'
          style={{
            width: badgeSize,
            height: badgeSize,
            fontSize: badgeSize * 0.62,
            boxShadow: '0 0 0 2px #FBF7EE'
          }}
          aria-label='Подтверждённый гид'
        >
          ✓
        </span>
      )}
    </span>
  );
};
