import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { ServerDurationLabel } from '@/entities/duration/server';
import { FavouriteLabel } from '@/entities/favourite';
import { PostCardEntity } from '@/entities/post/domain';
import { ServerRatingLabel } from '@/entities/rating/server';

import reserveImage from '@/shared/assets/images/backgrounds/bg-1.jpg';
import { BadgePrice } from '@/shared/ui/badge-price';
import { CardLayout } from '@/shared/ui/card-layout';

const cnPostCard = cn('TourCard');

export const PostCard: FC<PostCardEntity> = async ({
  id,
  slug,
  price,
  images,
  title,
  duration,
  metaPrice
}) => {
  const cardPrice = price || metaPrice;

  return (
    <CardLayout
      className={cnPostCard({ type: 'server' })}
      href={`/${slug}`}
      bgImage={
        images?.length && !!images[0]
          ? images[0]
          : (reserveImage as unknown as string)
      }
      title={title}
      favourite={<FavouriteLabel id={id} />}
      facts={
        <>
          {!!cardPrice && (
            <BadgePrice
              className={cnPostCard('Price')}
              price={cardPrice as number | string}
              variant='fact'
            />
          )}
          {!!duration && (
            <>
              {!!cardPrice && <span className='opacity-50'>·</span>}
              <ServerDurationLabel duration={duration} variant='fact' />
            </>
          )}
          <span className='opacity-50'>·</span>
          <ServerRatingLabel rating={4.9} variant='fact' />
        </>
      }
    />
  );
};
