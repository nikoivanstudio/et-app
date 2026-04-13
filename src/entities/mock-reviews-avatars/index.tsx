import { cn as cnBem } from '@bem-react/classname';
import { FC } from 'react';

import firstAvaUrl from '@/entities/mock-reviews-avatars/assets/images/ava1.jpg';
import secondAvaUrl from '@/entities/mock-reviews-avatars/assets/images/ava2.jpg';
import thirdAvaUrl from '@/entities/mock-reviews-avatars/assets/images/ava3.jpg';
import styles from '@/entities/mock-reviews-avatars/assets/styles.module.scss';

import { cn } from '@/shared/lib/css';
import { AvatarPhoto } from '@/shared/ui/avatar-photo';
import { BlackStar } from '@/shared/ui/black-star';

const cnMockReviewsAvatars = cnBem('MockReviewsAvatars');

export const MockReviewsAvatars: FC<{ rating: number }> = ({ rating }) => (
  <div
    className={cnMockReviewsAvatars(null, [
      'relative',
      'mt-[-30px]',
      styles.text__oswald
    ])}
  >
    <div
      className={cnMockReviewsAvatars('Rating', [
        'bg-white',
        'rounded-full',
        'flex',
        'justify-center',
        'items-center',
        'gap-0.5',
        'py-1',
        'mx-auto',
        'w-16'
      ])}
    >
      <BlackStar />{' '}
      <span className='text-black text-sm'>{rating || '4.9'}/5</span>
    </div>
    <div className={cnMockReviewsAvatars('List', ['flex', 'items-center'])}>
      <AvatarPhoto
        className='relative z-1'
        alt='first author'
        src={firstAvaUrl}
      />
      <AvatarPhoto
        className={cn(styles.MockAvatar, 'relative z-2')}
        alt='second author'
        src={secondAvaUrl}
      />
      <AvatarPhoto
        className={cn(styles.MockAvatar, 'relative z-3')}
        alt='third author'
        src={thirdAvaUrl}
      />
    </div>
  </div>
);
