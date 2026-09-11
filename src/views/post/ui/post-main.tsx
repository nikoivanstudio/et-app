'use server';

import { cn as cnBem } from '@bem-react/classname';
import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/ui/app-main';

import { PostDomain } from '@/entities/post/server';

import { cn } from '@/shared/lib/css';
import { postCrumbs } from '@/shared/lib/seo/breadcrumbs';
import { buildDescription } from '@/shared/lib/seo/description';
import {
  buildArticleJsonLd,
  buildAttractionJsonLd
} from '@/shared/lib/seo/json-ld';
import { JsonLd } from '@/shared/ui/json-ld';
import { LeadActions } from '@/shared/ui/lead-actions';
import { TextContent } from '@/shared/ui/text-content';
import { TourLinks } from '@/shared/ui/tour-links';

import { placeServices } from '@/kernel/place/server';
import { PageHeadPost } from '@/views/post/ui/page-head-post';
import { PostStats } from '@/views/post/ui/post-stats';

const cnPagePost = cnBem('PagePost');

export const PostMain: FC<PostDomain.PostEntity> = async props => {
  const {
    id,
    title,
    slug,
    description,
    image,
    content,
    metaDescription,
    metaDuration,
    metaPrice,
    price,
    duration,
    status,
    user,
    createdAt,
    updatedAt
  } = props;

  /**
   * Объект, о котором эта статья, — если он заведён (E1).
   *
   * Именно связь превращает справочник из энциклопедии в воронку: под
   * текстом про Мангуп-Кале появляются туры, которые туда заезжают,
   * а в разметке — `TouristAttraction` с координатами, то есть привязка
   * к сущности, которую Яндекс уже знает по своим Картам.
   *
   * Пока объекты не заведены, обе добавки просто не выводятся, и страница
   * остаётся ровно такой, какой была.
   */
  const place = await placeServices.getPlaceByPostId(id);
  const placeView = place
    ? await placeServices.getPlaceBySlug(place.slug)
    : null;
  const tours = placeView?.type === 'right' ? placeView.value.tours : [];

  const articleDescription = buildDescription(
    metaDescription || description,
    content
  );

  return (
    <AppMain
      mainHead={
        <PageHeadPost
          {...{ id, title, mainPhoto: image }}
          crumbs={postCrumbs(title)}
        />
      }
      mainContent={
        /* Контент поднимается на 32px и закрывает фото скруглением сверху —
           как на главной, странице тура и в каталоге. */
        <div
          className={cnPagePost('Content', [
            'bg-white',
            'rounded-t-[32px]',
            '-mt-8',
            'px-4',
            'pt-6',
            'pb-14',
            'md:px-6',
            'relative',
            'z-3'
          ])}
        >
          {/* Справочная страница — это Article: до C5 на всех 868 адресах
              сайта стояла одна и та же схема организации, вшитая
              в провайдер, а схемы самой страницы не было нигде. */}
          <JsonLd
            data={buildArticleJsonLd({
              title,
              description: articleDescription,
              path: `/${slug}`,
              image,
              datePublished: createdAt,
              dateModified: updatedAt,
              authorName:
                [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
                null
            })}
          />

          {/* Координаты объекта — то, ради чего TouristAttraction вообще
              нужен. Без них тип не даёт поисковику ничего сверх текста,
              поэтому схема выводится только вместе с ними. */}
          {!!place && place.latitude != null && place.longitude != null && (
            <JsonLd
              data={buildAttractionJsonLd({
                title: place.title,
                description: place.description ?? articleDescription,
                path: `/${slug}`,
                image: place.mainImage ?? image,
                latitude: place.latitude,
                longitude: place.longitude,
                city: place.city,
                district: place.district
              })}
            />
          )}

          {/* Колонка та же, что у .et-post (720px), иначе на десктопе
              «Информация» и плитки статистики растягивались во всю ширину. */}
          <div className={cn('mx-auto', 'w-full', 'max-w-[720px]')}>
            {/* Было: «Информация» и рядом мок «★ 4,9/5» с тремя стоковыми
                аватарами — рейтинг, который никто не ставил, на каждой
                странице сайта. */}
            <section className={cnPagePost('DescriptionBlock')}>
              <PostStats
                className=''
                priceValue={price}
                price={metaPrice}
                durationValue={duration}
                duration={metaDuration}
              />
            </section>
            <section className={cnPagePost('Body', ['mt-8'])}>
              {/* Тексты, перенесённые из WordPress, лежат одной строкой с
                  переносами — их разбираем на абзацы и списки. Посты нового
                  формата уже размечены и проходят как есть. */}
              <TextContent
                content={content as TrustedHTML}
                unstyled
                legacy={status === 'legacy'}
              />
            </section>

            <TourLinks
              className='mt-4'
              items={tours}
              title={place ? `Туры с заездом: ${place.title}` : undefined}
              lead='Маршруты, которые включают этот объект. Цена за машину до шести человек.'
            />

            {/* A7. Именно эти страницы и стоят в индексе — а заявку
                с них до сих пор оставить было нельзя: форма была только
                на `/tour/[slug]`, а телефон — только в подвале. */}
            <LeadActions
              className='mt-9'
              entityName={title}
              entityId={slug}
              note='Спросим про даты и подберём маршрут, который сюда заезжает'
            />
          </div>
        </div>
      }
      mainBottom={null}
    />
  );
};
