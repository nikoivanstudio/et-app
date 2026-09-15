/**
 * Что не сопоставилось со справочником городов.
 *
 * Миграция `20260915140000_add_city_and_geo_links` перенесла строки
 * `tour.start_city`, `place.city`, `user.city` и `tour.pickup_cities`
 * в ключи по названию без учёта регистра и приставки «г.». Всё, что
 * не совпало, осталось строкой без ключа: выдумывать город за
 * пользователя миграция не должна.
 *
 * Этот отчёт показывает остаток. Он же — условие для задачи 1-К:
 * строковые колонки удаляются только тогда, когда здесь ноль, иначе
 * удаление стало бы потерей данных.
 *
 * Заодно проверяется обратное: что у каждой посадочной с городом этот
 * город в справочнике есть. Опечатка в `citySlug` не роняет страницу —
 * она просто оставляет её без туров, и заметить это без проверки нельзя.
 *
 * Запуск: npm run geo:check-cities
 */

import 'dotenv/config';

import { getAllLandings } from '@/entities/landing/server';
import { getPublishedRegions } from '@/entities/region/server';

import { dbClient } from '@/shared/lib/db';

/**
 * То же приведение названия, что и в миграции: без него города, которые
 * миграция сопоставила правильно («г. Гурзуф» → Гурзуф), числились бы
 * здесь несопоставленными, скрипт всегда возвращал бы ненулевой код,
 * а задача 1-К не разблокировалась бы никогда.
 */
const normalizeCityName = (value: string): string =>
  value
    .trim()
    .replace(/^(г\.|г|город)\s+/i, '')
    .replace(/^г\.\s*/i, '')
    .trim()
    .toLowerCase();

const report = (title: string, values: string[]): number => {
  if (!values.length) {
    console.log(`✓ ${title}: всё сопоставлено`);

    return 0;
  }

  console.log(`✗ ${title}: ${values.length}`);
  values.forEach(value => console.log(`    ${value}`));

  return values.length;
};

const main = async () => {
  const [tours, places, users, cities] = await Promise.all([
    dbClient.tour.findMany({
      where: { startCityId: null, NOT: { startCity: null } },
      select: { id: true, title: true, startCity: true }
    }),
    dbClient.place.findMany({
      where: { cityId: null, NOT: { city: null } },
      select: { id: true, slug: true, city: true }
    }),
    dbClient.user.findMany({
      where: { cityId: null, NOT: { city: null } },
      select: { id: true, login: true, city: true }
    }),
    dbClient.city.findMany({ select: { slug: true, regionSlug: true } })
  ]);

  // Города подбора: строка осталась, а связи под неё нет.
  const toursWithPickup = await dbClient.tour.findMany({
    where: { NOT: { pickupCities: { isEmpty: true } } },
    select: {
      id: true,
      title: true,
      pickupCities: true,
      pickupCityLinks: { select: { city: { select: { title: true } } } }
    }
  });

  const unmatchedPickup = toursWithPickup.flatMap(tour => {
    const linked = new Set(
      tour.pickupCityLinks.map(link => normalizeCityName(link.city.title))
    );

    return tour.pickupCities
      .filter(name => !linked.has(normalizeCityName(name)))
      .map(name => `тур #${tour.id} «${tour.title}» → ${name}`);
  });

  const known = new Set(cities.map(city => `${city.regionSlug}/${city.slug}`));

  const unknownLandingCities = getAllLandings()
    .filter(landing => landing.citySlug)
    .filter(landing => !known.has(`${landing.regionSlug}/${landing.citySlug}`))
    .map(landing => `${landing.path} → ${landing.citySlug}`);

  const total =
    report(
      'города выезда у туров',
      tours.map(tour => `тур #${tour.id} «${tour.title}» → ${tour.startCity}`)
    ) +
    report('города подбора', unmatchedPickup) +
    report(
      'города объектов',
      places.map(place => `${place.slug} → ${place.city}`)
    ) +
    report(
      'города гидов',
      users.map(user => `#${user.id} ${user.login} → ${user.city}`)
    ) +
    report('города посадочных', unknownLandingCities);

  console.log(
    `\nРегионов опубликовано: ${getPublishedRegions().length}, городов в справочнике: ${cities.length}.`
  );

  if (total) {
    console.log(
      '\nПока список не пуст, строковые колонки удалять нельзя (задача 1-К в docs/geo/plan.md).'
    );
  }

  await dbClient.$disconnect();

  // Ненулевой код — чтобы проверку можно было поставить в конвейер.
  process.exit(total ? 1 : 0);
};

void main();
