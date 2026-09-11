import { absoluteUrl, SITE_URL } from '@/shared/constants/site-constants';

/**
 * Схемы страниц: тур, статья, объект, вопросы-ответы.
 *
 * Самый дешёвый прирост CTR в проекте: нишу не размечает никто из
 * конкурентов, максимум Open Graph. До этого на всех 868 страницах сайта
 * стояла одна и та же `TouristInformationCenter`, вшитая в провайдер, —
 * ни `Product`, ни `Offer`, ни `FAQPage`.
 *
 * Общее правило модуля, из которого следует всё остальное: **разметка
 * описывает то, что на странице видно**. Схема, обещающая рейтинг,
 * которого на странице нет, или цену, которой нет в карточке, — повод
 * снять расширенный сниппет целиком и надолго. Поэтому каждое
 * необязательное поле здесь появляется только вместе с данными.
 */

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const CURRENCY = 'RUB';

/** Ссылка на организацию вместо её повторного описания. */
const organizationRef = { '@id': ORGANIZATION_ID };

/**
 * Цена действительна до конца текущего года.
 *
 * Google требует `priceValidUntil` у офферов и перестаёт показывать
 * расширенный сниппет, когда дата прошла. Вычисляется, а не лежит
 * строкой: сайт уже четыре года ходил с заголовком «в 2022» ровно
 * из-за такого литерала.
 */
const getPriceValidUntil = (): string => `${new Date().getFullYear()}-12-31`;

/** За что цена: за машину целиком или за одного человека. */
export type PriceUnit = 'PER_CAR' | 'PER_PERSON';

/**
 * Описание единицы цены словами.
 *
 * В `Offer` нет поля «за машину», поэтому единственный честный способ
 * донести это до человека в сниппете — текст в `description` оффера.
 * Молчать нельзя: «от 8 000 ₽» за машину на шестерых и за человека —
 * это разница в шесть раз.
 */
const priceUnitLabel = (
  unit?: PriceUnit | null
): string | undefined => {
  if (unit === 'PER_CAR') return 'Цена за машину до 6 человек';
  if (unit === 'PER_PERSON') return 'Цена за одного человека';

  return undefined;
};

type TourJsonLdInput = {
  title: string;
  description: string;
  /** Канонический путь: '/tour/dzhip-tur-mangup'. */
  path: string;
  image?: string | null;
  price?: number | null;
  priceUnit?: PriceUnit | null;
  /** Длительность в часах — как она хранится в модели тура. */
  durationHours?: number | null;
  rating?: number | null;
  /**
   * Число отзывов, КОТОРЫЕ ВИДНЫ НА СТРАНИЦЕ. Именно видны: рейтинг
   * в разметке без отзывов в разметке и на экране — накрутка.
   */
  reviewsCount?: number;
  /** Имя гида — он же исполнитель услуги. */
  guideName?: string | null;
  /** Остановки маршрута для `itinerary`. */
  stops?: { name: string; latitude?: number; longitude?: number }[];
  startCity?: string | null;
};

/**
 * Карточка тура.
 *
 * Тип составной: `Product` даёт расширенный сниппет с ценой и рейтингом
 * (его понимают и Яндекс, и Google), `TouristTrip` — маршрут и
 * принадлежность к поездкам, которую Product выразить не может.
 * schema.org допускает несколько типов у одной сущности, и это честнее,
 * чем выводить два узла с одним и тем же оффером: сущность одна.
 *
 * `aggregateRating` появляется только при наличии отзывов — см. ниже.
 */
export const buildTourJsonLd = ({
  title,
  description,
  path,
  image,
  price,
  priceUnit,
  durationHours,
  rating,
  reviewsCount = 0,
  guideName,
  stops = [],
  startCity
}: TourJsonLdInput) => {
  const url = absoluteUrl(path);

  // Рейтинг выводим, только когда отзывы реально есть. Это не
  // перестраховка: за `aggregateRating` без отзывов на странице
  // снимают расширенный сниппет целиком, и вернуть его труднее,
  // чем не получить. Модель Review в базе есть, отзывов нет ни одного
  // (задача G5 — наладить их сбор).
  const hasRating = !!rating && rating > 0 && reviewsCount > 0;

  const itinerary = stops
    .map((stop, index) => ({
      '@type': 'TouristAttraction' as const,
      name: stop.name,
      position: index + 1,
      ...(stop.latitude != null && stop.longitude != null
        ? { geo: buildGeo(stop.latitude, stop.longitude) }
        : {})
    }))
    .filter(item => !!item.name);

  return {
    '@context': 'https://schema.org',
    '@type': ['Product', 'TouristTrip'],
    '@id': `${url}#tour`,
    name: title,
    url,
    ...(description ? { description } : {}),
    ...(image ? { image: [image] } : {}),
    brand: organizationRef,
    provider: organizationRef,
    ...(guideName
      ? {
          tourBookingPage: url,
          performer: { '@type': 'Person', name: guideName }
        }
      : {}),
    // ISO 8601: 8 часов — PT8H. Длительность участвует в сниппете
    // и отвечает на первый вопрос посетителя.
    ...(durationHours ? { duration: `PT${durationHours}H` } : {}),
    ...(startCity
      ? {
          departureLocation: {
            '@type': 'Place',
            name: startCity,
            address: {
              '@type': 'PostalAddress',
              addressLocality: startCity,
              addressRegion: 'Республика Крым',
              addressCountry: 'RU'
            }
          }
        }
      : {}),
    ...(itinerary.length
      ? {
          itinerary: {
            '@type': 'ItemList',
            numberOfItems: itinerary.length,
            itemListElement: itinerary
          }
        }
      : {}),
    ...(price
      ? {
          offers: {
            '@type': 'Offer',
            price,
            priceCurrency: CURRENCY,
            availability: 'https://schema.org/InStock',
            url,
            priceValidUntil: getPriceValidUntil(),
            seller: organizationRef,
            ...(priceUnitLabel(priceUnit)
              ? { description: priceUnitLabel(priceUnit) }
              : {})
          }
        }
      : {}),
    ...(hasRating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating,
            reviewCount: reviewsCount,
            bestRating: 5,
            worstRating: 1
          }
        }
      : {})
  };
};

/** Координаты в виде, который понимают и Яндекс, и Google. */
export const buildGeo = (latitude: number, longitude: number) => ({
  '@type': 'GeoCoordinates',
  latitude,
  longitude
});

type ArticleJsonLdInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  datePublished?: Date | string | null;
  dateModified?: Date | string | null;
  authorName?: string | null;
};

const toIsoDate = (value: Date | string | null | undefined): string | null => {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

/**
 * Справочная страница.
 *
 * `Article`, а не `BlogPosting`: справочник — это описания объектов, а не
 * дневниковые записи. Дата правки здесь не украшение: Яндекс показывает её
 * в сниппете, и у материала 2018 года без даты шансов против свежей статьи
 * конкурента нет — с датой хотя бы видно, что материал не обновляли, и это
 * повод его обновить (F3), а не скрыть.
 */
export const buildArticleJsonLd = ({
  title,
  description,
  path,
  image,
  datePublished,
  dateModified,
  authorName
}: ArticleJsonLdInput) => {
  const url = absoluteUrl(path);
  const published = toIsoDate(datePublished);
  const modified = toIsoDate(dateModified) ?? published;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: title,
    url,
    // mainEntityOfPage обязателен: без него поисковик не знает, что статья
    // и страница — одно и то же, и может привязать её к другому адресу.
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(description ? { description } : {}),
    ...(image ? { image: [image] } : {}),
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    author: authorName
      ? { '@type': 'Person', name: authorName }
      : organizationRef,
    publisher: organizationRef
  };
};

type AttractionJsonLdInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  city?: string | null;
  district?: string | null;
};

/**
 * Объект: пещерный город, каньон, дворец.
 *
 * Смысл именно в координатах. `TouristAttraction` с `geo` — это привязка
 * к сущности, которую Яндекс уже знает по своим Картам: страница перестаёт
 * быть «текстом про Мангуп» и становится страницей ОБ объекте Мангуп.
 * Без координат тип почти бесполезен, поэтому при их отсутствии схема
 * не выводится вовсе (см. `buildPlaceJsonLd` ниже).
 */
export const buildAttractionJsonLd = ({
  title,
  description,
  path,
  image,
  latitude,
  longitude,
  city,
  district
}: AttractionJsonLdInput) => {
  const url = absoluteUrl(path);

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': `${url}#attraction`,
    name: title,
    url,
    ...(description ? { description } : {}),
    ...(image ? { image: [image] } : {}),
    ...(latitude != null && longitude != null
      ? { geo: buildGeo(latitude, longitude) }
      : {}),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'RU',
      addressRegion: 'Республика Крым',
      ...(city ? { addressLocality: city } : {}),
      ...(district ? { addressSubregion: district } : {})
    },
    isAccessibleForFree: true,
    touristType: 'Активный отдых'
  };
};

export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * Вопросы и ответы.
 *
 * Требование, которое легко нарушить незаметно: каждый вопрос и ответ
 * обязан быть виден на странице. Скрытый в разметке FAQ — нарушение
 * правил обоих поисковиков, и ловится оно автоматикой.
 *
 * Возвращает `null`, когда вопросов нет: пустой `FAQPage` — это заявка
 * на расширенный сниппет без содержимого.
 */
export const buildFaqJsonLd = (items: FaqItem[]) => {
  const filled = items.filter(
    item => !!item.question?.trim() && !!item.answer?.trim()
  );

  if (!filled.length) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: filled.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer.trim()
      }
    }))
  };
};

type PlaceJsonLdInput = AttractionJsonLdInput & {
  /** Туры, которые сюда заезжают: попадают в `subjectOf`. */
  tours?: { title: string; path: string }[];
};

/**
 * Страница объекта целиком: достопримечательность плюс ссылки на туры.
 *
 * `null`, если координат нет: `TouristAttraction` без `geo` не даёт
 * поисковику ничего, чего он не взял бы из текста, а лишний узел
 * в разметке — лишний повод для расхождения с содержимым страницы.
 */
export const buildPlaceJsonLd = ({
  tours = [],
  ...attraction
}: PlaceJsonLdInput) => {
  if (attraction.latitude == null || attraction.longitude == null) {
    return null;
  }

  const base = buildAttractionJsonLd(attraction);

  if (!tours.length) {
    return base;
  }

  return {
    ...base,
    subjectOf: tours.map(tour => ({
      '@type': 'TouristTrip',
      name: tour.title,
      url: absoluteUrl(tour.path),
      provider: organizationRef
    }))
  };
};

type ItemListInput = {
  path: string;
  name: string;
  items: { title: string; path: string }[];
};

/**
 * Список на странице каталога.
 *
 * `ItemList` ссылками, а не полными карточками: список из двадцати
 * `Product` со своими офферами на странице каталога — это заявка на
 * товарный сниппет там, где товара нет, только перечень.
 */
export const buildItemListJsonLd = ({ path, name, items }: ItemListInput) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${absoluteUrl(path)}#list`,
  name,
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.title,
    url: absoluteUrl(item.path)
  }))
});
