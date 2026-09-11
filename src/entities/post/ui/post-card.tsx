import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { ServerDurationLabel } from '@/entities/duration/server';
import { FavouriteLabel } from '@/entities/favourite';
import { PostCardEntity } from '@/entities/post/domain';

import reserveImage from '@/shared/assets/images/backgrounds/bg-1.jpg';
import { BadgePrice } from '@/shared/ui/badge-price';
import { CardLayout } from '@/shared/ui/card-layout';

const cnPostCard = cn('TourCard');

export const PostCard: FC<PostCardEntity> = async ({
  id,
  slug,
  price,
  image,
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
      /* Галерея, потом одиночная обложка, и только потом запасной кадр:
         у части постов заполнено только `image`, и все карточки шли под
         одним и тем же фото. */
      bgImage={images?.[0] || image || (reserveImage as unknown as string)}
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
          {/* Было: `<ServerRatingLabel rating={4.9} />` — одна и та же
              захардкоженная оценка на каждой карточке. Оценок у постов нет. */}
        </>
      }
    />
  );
};
