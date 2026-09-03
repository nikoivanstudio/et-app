import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { dbClient } from '@/shared/lib/db';
import { LegacyTourCardData } from '@/shared/model/types';

import {
  firstPage,
  longTours,
  secondPage,
  shortTours
} from '@/views/legacy/constants/tours';

/**
 * Посты туров для локальной разработки.
 *
 * Страницы туров живут на динамическом роуте /[slug] и целиком берутся из
 * таблицы post. На чистой базе таблица пустая — поэтому любой /[slug] отдаёт
 * 404 и посмотреть страницу тура невозможно. Сид заводит по посту на каждую
 * ссылку из легаси-каталога (src/views/legacy/constants/tours.ts).
 *
 * Контент нового формата (.et-post) уже готов для пяти туров — он лежит
 * рядом в constants/*.html. Для остальных кладём каркас, собранный только из
 * известных фактов (название, цена, длительность): описание маршрута
 * наполняется в админке.
 */

const CONTENT_DIR = join(process.cwd(), 'src/views/legacy/constants');

const CONTENT_BY_SLUG: Record<string, string> = {
  'safari-progulki-na-vnedorozhnikah-i-dzhipah-po-krymu-v-2020': 'safari.html',
  'eski-kermen-2': 'eski.html',
  'tepe-kermen-2': 'tepe.html',
  'individualnaya-ekskursiya-po-krymu-tur-bezlimitnyj': 'bezlimit.html',
  'drevnij-belbek': 'tri-kreposti.html'
};

/** Из готовой html-страницы забираем только блок <div class="et-post">…</div>. */
const extractEtPost = (html: string): string => {
  const start = html.indexOf('<div class="et-post">');
  const end = html.lastIndexOf('</div>');

  if (start === -1 || end === -1) {
    throw new Error('В файле контента нет блока .et-post');
  }

  return html.slice(start, end + '</div>'.length).trim();
};

const parsePrice = (price: string): number | null => {
  const digits = price.replace(/[^\d]/g, '');

  return digits ? Number(digits) : null;
};

/** «4–5 часов» → 4 часа в секундах: берём первое число. */
const parseDurationSeconds = (duration: string): number | null => {
  const match = duration.match(/\d+/);

  return match ? Number(match[0]) * 3600 : null;
};

const stubContent = (tour: LegacyTourCardData): string => `<div class="et-post">
  <h2 class="et-h">О туре</h2>
  <p class="et-lead">${tour.title}.</p>

  <h2 class="et-h">Стоимость</h2>
  <div class="et-price">
    <div class="et-price-label">ЦЕНА ЗА МАШИНУ</div>
    <div class="et-price-value">${tour.price.replace(/^от\s*/i, '')}</div>
    <div class="et-price-note">без учёта скидки</div>
  </div>

  <h2 class="et-h">Полезно знать</h2>
  <div class="et-info-grid">
    <div class="et-info">
      <div class="et-info-label">Старт</div>
      <div class="et-info-value">Бахчисарай или по согласованию</div>
    </div>
    <div class="et-info">
      <div class="et-info-label">Длительность</div>
      <div class="et-info-value">${tour.duration}, нестрого</div>
    </div>
    <div class="et-info">
      <div class="et-info-label">Группа</div>
      <div class="et-info-value">До 6 человек</div>
    </div>
  </div>
  <p class="et-tickets-note">Описание маршрута готовится.</p>

  <a class="et-cta" href="#contact">Забронировать тур</a>
  <div class="et-cta-note">Ответим в течение часа</div>
</div>`;

const contentFor = (slug: string, tour: LegacyTourCardData): string => {
  const file = CONTENT_BY_SLUG[slug];

  if (!file) {
    return stubContent(tour);
  }

  return extractEtPost(readFileSync(join(CONTENT_DIR, file), 'utf8'));
};

/** Уникальные туры по href: одна ссылка каталога — один пост. */
const collectTours = (): LegacyTourCardData[] => {
  const byHref = new Map<string, LegacyTourCardData>();

  for (const tour of [
    ...longTours,
    ...shortTours,
    ...firstPage,
    ...secondPage
  ]) {
    if (!byHref.has(tour.href)) {
      byHref.set(tour.href, tour);
    }
  }

  return [...byHref.values()];
};

export const seedPosts = async (postAuthorId: number) => {
  const tours = collectTours();

  for (const tour of tours) {
    const slug = tour.href.replace(/^\//, '');
    const price = parsePrice(tour.price);
    const duration = parseDurationSeconds(tour.duration);

    const data = {
      title: tour.title,
      description: tour.title,
      content: contentFor(slug, tour),
      postAuthorId,
      type: 'post',
      guid: slug.slice(0, 80),
      image: tour.img,
      images: [],
      status: 'legacy',
      categories: ['tours'],
      metaKeywords: [],
      metaTitle: tour.title,
      metaDescription: `${tour.title} — ${tour.duration}, ${tour.price}. Выезд из Бахчисарая.`,
      metaPrice: tour.price,
      metaDuration: tour.duration,
      price,
      duration,
      link: null
    };

    await dbClient.post.upsert({
      where: { slug },
      update: data,
      create: { ...data, slug }
    });
  }

  console.log(
    `✓ posts: ${tours.length} (готовый .et-post контент — у ${Object.keys(CONTENT_BY_SLUG).length})`
  );
};
