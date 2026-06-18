import { FC } from 'react';

import { TourContent } from '@/entities/tour/model/content';

type TourGalleryPhoto = {
  source: string;
  title?: string;
};

type TourContentViewProps = {
  content: TourContent;
  photos?: TourGalleryPhoto[];
};

// Обычный (не серверный) компонент: используется и в серверном рендере
// публичной страницы тура, и в клиентском предпросмотре в реальном времени.
export const TourContentView: FC<TourContentViewProps> = ({
  content,
  photos = []
}) => {
  const {
    lead,
    tags,
    routeStops,
    priceLabel,
    priceValue,
    priceNote,
    vkUrl,
    tickets,
    ticketsNote,
    info,
    awaitsParagraphs,
    awaitsHighlightsTitle,
    awaitsHighlights
  } = content;

  const hasAboutSection = !!lead || !!tags.length;
  const hasAwaits = !!awaitsParagraphs.length || !!awaitsHighlights.length;

  return (
    <div className='et-post'>
      {hasAboutSection && (
        <>
          <h2 className='et-h'>О туре</h2>
          {!!lead && <p className='et-lead'>{lead}</p>}
          {!!tags.length && (
            <ul className='et-tags'>
              {tags.map((tag, idx) => (
                <li className='et-tag' key={idx}>
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {!!routeStops.length && (
        <>
          <h2 className='et-h'>Маршрут</h2>
          <ol className='et-route'>
            {routeStops.map((stop, idx) => (
              <li
                key={idx}
                className={idx === routeStops.length - 1 ? 'last' : undefined}
              >
                <span className='et-num'>{idx + 1}</span>
                <p className='et-title'>
                  {stop.titleHref ? (
                    <a href={stop.titleHref}>{stop.title}</a>
                  ) : (
                    stop.title
                  )}
                </p>
                {!!stop.sub && (
                  <p className='et-sub'>
                    {stop.sub}
                    {stop.wikiHref && (
                      <>
                        {' '}
                        (
                        <a href={stop.wikiHref} rel='noopener' target='_blank'>
                          wiki
                        </a>
                        )
                      </>
                    )}
                  </p>
                )}
                {!!stop.coordinates && (
                  <p className='et-coord'>{stop.coordinates}</p>
                )}
              </li>
            ))}
          </ol>
        </>
      )}

      {!!priceValue && (
        <>
          <h2 className='et-h'>Стоимость</h2>
          <div className='et-price'>
            {!!priceLabel && <div className='et-price-label'>{priceLabel}</div>}
            <div className='et-price-value'>{priceValue}</div>
            {!!priceNote && <div className='et-price-note'>{priceNote}</div>}
          </div>
          {!!vkUrl && (
            <a className='et-vk' href={vkUrl} rel='noopener' target='_blank'>
              <span>Скидки подписчикам ВКонтакте</span>
              <span className='et-arrow'>→</span>
            </a>
          )}
        </>
      )}

      {!!tickets.length && (
        <>
          <h2 className='et-h'>Билеты</h2>
          <div className='et-tickets'>
            {tickets.map((ticket, idx) => (
              <div className='et-ticket' key={idx}>
                <span className='et-tlabel'>
                  {ticket.label}
                  {!!ticket.hint && (
                    <span className='et-thint'> · {ticket.hint}</span>
                  )}
                </span>
                {ticket.free ? (
                  <span className='et-tfree'>бесплатно</span>
                ) : (
                  <span className='et-tprice'>{ticket.price}</span>
                )}
              </div>
            ))}
          </div>
          {!!ticketsNote && <p className='et-tickets-note'>{ticketsNote}</p>}
        </>
      )}

      {!!info.length && (
        <>
          <h2 className='et-h'>Полезно знать</h2>
          <div className='et-info-grid'>
            {info.map((item, idx) => (
              <div className='et-info' key={idx}>
                <div className='et-info-label'>{item.label}</div>
                <div className='et-info-value'>{item.value}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {hasAwaits && (
        <>
          <h2 className='et-h'>Что вас ждёт</h2>
          <div className='et-awaits'>
            {awaitsParagraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
            {!!awaitsHighlights.length && (
              <div className='et-awaits-divider'>
                {!!awaitsHighlightsTitle && (
                  <p className='et-awaits-title'>{awaitsHighlightsTitle}</p>
                )}
                <ul>
                  {awaitsHighlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      {!!photos.length && (
        <>
          <h2 className='et-h'>Фото с тура</h2>
          <div className='et-gallery'>
            {photos.map((photo, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={idx}
                src={photo.source}
                alt={photo.title || ''}
                loading='lazy'
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
