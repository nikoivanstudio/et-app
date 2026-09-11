/**
 * Валидация микроразметки (задача H3).
 *
 * Разметка — единственная часть SEO, ошибка в которой не просто
 * не помогает, а наказывается: за `AggregateRating` без отзывов
 * на странице снимают расширенный сниппет целиком, и вернуть его
 * труднее, чем не получить. Поэтому правило «схема описывает то,
 * что на странице видно» закреплено тестами, а не комментарием.
 *
 * @jest-environment node
 */
import {
  buildArticleJsonLd,
  buildAttractionJsonLd,
  buildFaqJsonLd,
  buildItemListJsonLd,
  buildPlaceJsonLd,
  buildTourJsonLd
} from './json-ld';

const BASE = 'https://energy-tur.ru';

const tourInput = {
  title: 'Джип-тур на Мангуп-Кале',
  description: 'Подъём к самому большому пещерному городу Крыма.',
  path: '/tour/dzhip-tur-mangup',
  image: `${BASE}/photo.jpg`,
  price: 10500,
  durationHours: 5
};

/** Обязательные поля есть у каждой схемы — без них она не читается вовсе. */
const expectValidSchema = (schema: Record<string, unknown>) => {
  expect(schema['@context']).toBe('https://schema.org');
  expect(schema['@type']).toBeDefined();
  expect(JSON.stringify(schema)).not.toContain('undefined');
};

describe('разметка тура', () => {
  test('это Product и TouristTrip одновременно', () => {
    const schema = buildTourJsonLd(tourInput);

    expectValidSchema(schema);
    // Product даёт расширенный сниппет с ценой, TouristTrip — маршрут,
    // который Product выразить не может.
    expect(schema['@type']).toEqual(['Product', 'TouristTrip']);
    expect(schema.name).toBe(tourInput.title);
    expect(schema.url).toBe(`${BASE}/tour/dzhip-tur-mangup`);
  });

  test('оффер несёт цену, валюту, доступность и срок действия', () => {
    const { offers } = buildTourJsonLd(tourInput) as {
      offers: Record<string, unknown>;
    };

    expect(offers.price).toBe(10500);
    expect(offers.priceCurrency).toBe('RUB');
    expect(offers.availability).toBe('https://schema.org/InStock');
    // Google перестаёт показывать расширенный сниппет, когда дата прошла.
    expect(offers.priceValidUntil).toBe(`${new Date().getFullYear()}-12-31`);
  });

  test('без цены оффера нет вовсе', () => {
    // Оффер без цены — заявка на товарный сниппет без товара.
    const schema = buildTourJsonLd({ ...tourInput, price: null });

    expect(schema).not.toHaveProperty('offers');
  });

  test('единица цены попадает в описание оффера', () => {
    // В Offer нет поля «за машину», а разница между ценой за машину
    // на шестерых и за человека — шестикратная.
    const { offers } = buildTourJsonLd({
      ...tourInput,
      priceUnit: 'PER_CAR'
    }) as { offers: Record<string, unknown> };

    expect(offers.description).toContain('за машину');
  });

  test('рейтинга нет, пока нет отзывов', () => {
    // Главное правило C3. Модель Review в базе есть, отзывов нет
    // ни одного (G5), и разметка обязана это отражать.
    const schema = buildTourJsonLd({
      ...tourInput,
      rating: 4.9,
      reviewsCount: 0
    });

    expect(schema).not.toHaveProperty('aggregateRating');
  });

  test('рейтинг появляется вместе с отзывами', () => {
    const schema = buildTourJsonLd({
      ...tourInput,
      rating: 4.9,
      reviewsCount: 12
    }) as { aggregateRating: Record<string, unknown> };

    expect(schema.aggregateRating.ratingValue).toBe(4.9);
    expect(schema.aggregateRating.reviewCount).toBe(12);
    expect(schema.aggregateRating.bestRating).toBe(5);
  });

  test('нулевой рейтинг не выводится даже при отзывах', () => {
    const schema = buildTourJsonLd({
      ...tourInput,
      rating: 0,
      reviewsCount: 5
    });

    expect(schema).not.toHaveProperty('aggregateRating');
  });

  test('длительность в формате ISO 8601', () => {
    expect(buildTourJsonLd(tourInput).duration).toBe('PT5H');
  });

  test('остановки без координат не получают выдуманных geo', () => {
    const schema = buildTourJsonLd({
      ...tourInput,
      stops: [
        { name: 'Мангуп-Кале', latitude: 44.5952, longitude: 33.8078 },
        { name: 'Ходжа-Сала' }
      ]
    }) as { itinerary: { itemListElement: Record<string, unknown>[] } };

    expect(schema.itinerary.itemListElement).toHaveLength(2);
    expect(schema.itinerary.itemListElement[0].geo).toBeDefined();
    expect(schema.itinerary.itemListElement[1].geo).toBeUndefined();
  });
});

describe('разметка статьи', () => {
  const articleInput = {
    title: 'Пещерный город Эски-Кермен',
    description: 'Городище с осадным колодцем на шесть маршей.',
    path: '/eski-kermen',
    datePublished: new Date('2018-06-01T00:00:00.000Z'),
    dateModified: new Date('2026-05-05T00:00:00.000Z')
  };

  test('это Article с привязкой к странице', () => {
    const schema = buildArticleJsonLd(articleInput);

    expectValidSchema(schema);
    expect(schema['@type']).toBe('Article');
    // Без mainEntityOfPage поисковик не знает, что статья и страница —
    // одно и то же, и может привязать её к другому адресу.
    expect(schema.mainEntityOfPage).toEqual({
      '@type': 'WebPage',
      '@id': `${BASE}/eski-kermen`
    });
  });

  test('даты приводятся к ISO', () => {
    const schema = buildArticleJsonLd(articleInput);

    expect(schema.datePublished).toBe('2018-06-01T00:00:00.000Z');
    expect(schema.dateModified).toBe('2026-05-05T00:00:00.000Z');
  });

  test('без даты правки берётся дата публикации', () => {
    const schema = buildArticleJsonLd({
      ...articleInput,
      dateModified: null
    });

    expect(schema.dateModified).toBe(schema.datePublished);
  });

  test('битая дата не попадает в разметку', () => {
    const schema = buildArticleJsonLd({
      ...articleInput,
      datePublished: 'не дата',
      dateModified: null
    });

    expect(schema).not.toHaveProperty('datePublished');
  });
});

describe('разметка объекта', () => {
  const attractionInput = {
    title: 'Мангуп-Кале',
    description: 'Самое большое городище полуострова.',
    path: '/mesta/mangup-kale',
    latitude: 44.5952,
    longitude: 33.8078,
    city: 'Бахчисарай'
  };

  test('координаты — то, ради чего тип и нужен', () => {
    const schema = buildAttractionJsonLd(attractionInput);

    expectValidSchema(schema);
    expect(schema['@type']).toBe('TouristAttraction');
    expect(schema.geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: 44.5952,
      longitude: 33.8078
    });
  });

  test('без координат схема объекта не выводится', () => {
    // TouristAttraction без geo не даёт поисковику ничего сверх текста,
    // зато добавляет узел, который может разойтись с содержимым.
    expect(
      buildPlaceJsonLd({
        ...attractionInput,
        latitude: null,
        longitude: null
      })
    ).toBeNull();
  });

  test('туры объекта попадают в subjectOf', () => {
    const schema = buildPlaceJsonLd({
      ...attractionInput,
      tours: [{ title: 'Легенды Мангупа', path: '/tour/legendy-mangupa' }]
    }) as { subjectOf: Record<string, unknown>[] };

    expect(schema.subjectOf).toHaveLength(1);
    expect(schema.subjectOf[0].url).toBe(`${BASE}/tour/legendy-mangupa`);
  });
});

describe('разметка вопросов и ответов', () => {
  test('пустой список не даёт схемы', () => {
    // Пустой FAQPage — заявка на расширенный сниппет без содержимого.
    expect(buildFaqJsonLd([])).toBeNull();
    expect(buildFaqJsonLd([{ question: '  ', answer: 'Да' }])).toBeNull();
  });

  test('вопрос без ответа отбрасывается', () => {
    const schema = buildFaqJsonLd([
      { question: 'Сколько мест в машине?', answer: 'Шесть.' },
      { question: 'А это?', answer: '' }
    ]) as { mainEntity: Record<string, unknown>[] };

    expect(schema.mainEntity).toHaveLength(1);
  });

  test('структура соответствует FAQPage', () => {
    const schema = buildFaqJsonLd([
      { question: 'Сколько мест в машине?', answer: 'Шесть.' }
    ]) as Record<string, unknown>;

    expectValidSchema(schema);
    expect(schema['@type']).toBe('FAQPage');
    expect((schema.mainEntity as Record<string, unknown>[])[0]).toEqual({
      '@type': 'Question',
      name: 'Сколько мест в машине?',
      acceptedAnswer: { '@type': 'Answer', text: 'Шесть.' }
    });
  });
});

describe('разметка списка', () => {
  test('позиции нумеруются с единицы и несут абсолютные адреса', () => {
    const schema = buildItemListJsonLd({
      path: '/mesta',
      name: 'Места Крыма',
      items: [
        { title: 'Мангуп-Кале', path: '/mesta/mangup-kale' },
        { title: 'Чуфут-Кале', path: '/mesta/chufut-kale' }
      ]
    });

    expectValidSchema(schema);
    expect(schema.numberOfItems).toBe(2);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].url).toBe(`${BASE}/mesta/chufut-kale`);
  });
});

describe('сериализация', () => {
  test('закрывающий тег внутри данных не ломает страницу', () => {
    // Экранирование `<` обязательно: без него строка `</script>`
    // в пользовательском тексте закрыла бы тег раньше времени.
    const schema = buildArticleJsonLd({
      title: 'Тест </script><img src=x onerror=alert(1)>',
      description: '',
      path: '/test'
    });

    const serialized = JSON.stringify(schema).replace(/</g, '\\u003c');

    expect(serialized).not.toContain('</script>');
  });
});
