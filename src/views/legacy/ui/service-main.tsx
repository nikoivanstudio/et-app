'use server';

import Link from 'next/link';
import { FC } from 'react';

import { AppMain } from '@/widgets/app-main/ui/app-main';
import { CONTACTS } from '@/widgets/contacts/constants/contacts';

import { formatNumber } from '@/shared/lib/string-utils';
import { DetailBlock, IncludeRow, PriceRow } from '@/shared/ui/detail-block';
import { LinkButton } from '@/shared/ui/link-button';
import { SectionHeading } from '@/shared/ui/section-heading';
import { TextContent } from '@/shared/ui/text-content';

import { PageHeadPost } from '@/views/post/ui/page-head-post';

import { SERVICE_DETAILS } from '../constants/service-details';
import { services } from '../constants/services';
import { ServiceViewProps } from '../domain';

/** Ниже этой длины `content` — заглушка вида «Классические экскурсии в Крыму». */
const RAW_CONTENT_MIN_LENGTH = 160;

/**
 * Страница услуги.
 *
 * Было: шапка 85vh без скрима (на прокате квадроциклов фото вообще не
 * существовало — H1 лежал на серой заглушке с контрастом 3,4:1), под ней
 * «Информация» и мок «★ 4,9/5» с тремя стоковыми аватарами, а дальше стена
 * текста из WordPress на 40–50 строк: цены внутри предложений, «-» вместо
 * маркеров, склеенные слова, картинка 300px, прижатая влево. Ни кнопки, ни
 * телефона, ни цены — заказать услугу со страницы услуги было нельзя.
 */
export const ServiceMain: FC<ServiceViewProps> = async props => {
  const { title, mainImage, content, slug } = props;

  const details = slug ? SERVICE_DETAILS[slug] : undefined;
  const card = services.find(service => service.href.endsWith(`/${slug}`));
  /* Этим же шаблоном рендерятся и не-услуги — /tury, /ekskursii-po-krymu,
     /turisticheskie-priklyucheniya-v-krymu. Для них не нужны ни крошка
     «Услуги», ни блок «Другие услуги». */
  const isService = !!card;
  const others = isService
    ? services.filter(service => service !== card).slice(0, 3)
    : [];
  const phone = CONTACTS.phones[0];
  const hasRawContent = content.trim().length >= RAW_CONTENT_MIN_LENGTH;

  return (
    <AppMain
      mainHead={
        <PageHeadPost
          id={props.id}
          title={title}
          mainPhoto={mainImage}
          crumbs={
            isService
              ? [
                  { label: 'Главная', href: '/' },
                  { label: 'Услуги', href: '/uslugi' },
                  { label: title }
                ]
              : [{ label: 'Главная', href: '/' }, { label: title }]
          }
          facts={
            !!card && (
              <>
                {/* Цену в шапке показываем только там, где ниже нет своего
                    прайса: у проката квадроциклов в карточке стоит «от 3 000 ₽»,
                    а в тексте страницы — «1 500 рублей в час», и рядом это
                    читалось как ошибка. */}
                {!details?.priceRows?.length && (
                  <>
                    <span className='text-[20px] font-medium whitespace-nowrap'>
                      {card.price}
                    </span>
                    <span className='opacity-50'>·</span>
                  </>
                )}
                <span className='opacity-90'>{card.duration}</span>
              </>
            )
          }
        />
      }
      mainContent={
        /* Единственный наезд: бумага поднимается на 32px и закрывает фото. */
        <div className='relative z-3 -mt-8 rounded-t-[32px] bg-white px-4 pt-7 pb-14 md:px-6'>
          <div className='mx-auto w-full max-w-[720px]'>
            {!!details && (
              <p className='font-caladea text-ink text-[15.5px] leading-relaxed'>
                {details.lead}
              </p>
            )}

            {!!details?.priceRows?.length && (
              <>
                <SectionHeading>Стоимость</SectionHeading>
                <DetailBlock>
                  {details.priceRows.map(row => (
                    <PriceRow key={row.name} {...row} />
                  ))}
                </DetailBlock>
              </>
            )}

            {!!details?.includes?.length && (
              <>
                <SectionHeading>Что входит</SectionHeading>
                <DetailBlock>
                  {details.includes.map(item => (
                    <IncludeRow key={item}>{item}</IncludeRow>
                  ))}
                </DetailBlock>
              </>
            )}

            {!!details?.steps?.length && (
              <>
                <SectionHeading>Как это проходит</SectionHeading>
                <ol className='flex flex-col gap-3'>
                  {details.steps.map((step, idx) => (
                    <li key={step} className='relative pl-9'>
                      <span className='bg-gold-plate text-cream font-oswald absolute top-0 left-0 flex size-6.5 items-center justify-center rounded-full text-[13px] font-semibold'>
                        {idx + 1}
                      </span>
                      <span className='font-caladea text-ink text-[14.5px] leading-relaxed'>
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {!!details?.conditions?.length && (
              <>
                <SectionHeading>Условия</SectionHeading>
                <ul className='flex flex-col gap-2'>
                  {details.conditions.map(item => (
                    <li key={item} className='relative pl-4'>
                      <span className='bg-gold-plate absolute top-[9px] left-0 size-1.5 rounded-full' />
                      <span className='font-caladea text-ink-muted text-[13.5px] leading-relaxed'>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Заявка и телефон прямо на странице — до этого заказать услугу
                можно было только из подвала. */}
            <div className='mt-9 flex flex-col gap-2.5'>
              {isService ? (
                <LinkButton className='w-full' href={`tel:${phone}`}>
                  Позвонить {formatNumber(phone)}
                </LinkButton>
              ) : (
                <LinkButton className='w-full' href='/category/vse_tury'>
                  Смотреть все туры
                </LinkButton>
              )}
              <Link
                className='border-rule text-ink hover:bg-cream-deep rounded-pill font-oswald inline-flex min-h-12 w-full items-center justify-center border bg-transparent text-[15px] tracking-wide transition-colors'
                href={isService ? CONTACTS.telegram : `tel:${phone}`}
              >
                {isService
                  ? 'Написать в Telegram'
                  : `Позвонить ${formatNumber(phone)}`}
              </Link>
              <p className='font-oswald text-ink-faint mt-0.5 text-center text-[12.5px]'>
                Расскажем про маршрут и подберём даты
              </p>
            </div>

            {hasRawContent && (
              <>
                <SectionHeading className='mt-10'>Подробно</SectionHeading>
                {/* Тот же текст, что был, но в типографике постов: колонка
                    720, списки и таблицы вместо сплошного абзаца. */}
                <div className='et-post'>
                  <TextContent
                    content={content as TrustedHTML}
                    unstyled
                    legacy
                  />
                </div>
              </>
            )}

            {!!others.length && (
              <>
                <SectionHeading className='mt-10'>Другие услуги</SectionHeading>
                <ul className='flex flex-col gap-2'>
                  {others.map(service => (
                    <li key={service.id}>
                      <Link
                        className='border-rule bg-cream hover:bg-cream-deep rounded-block flex min-h-[54px] items-center gap-3 border p-3 transition-colors'
                        href={service.href}
                      >
                        <span className='min-w-0 flex-1'>
                          <span className='font-caladea text-ink block text-[14.5px] font-bold'>
                            {service.title}
                          </span>
                          <span className='font-oswald text-gold-ink text-[12.5px]'>
                            {service.price}
                          </span>
                        </span>
                        <span className='text-gold-ink shrink-0 text-[15px]'>
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      }
      mainBottom={null}
    />
  );
};
