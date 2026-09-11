import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  buildBreadcrumbJsonLd,
  geoCrumbs,
  guideCrumbs,
  HOME_CRUMB,
  placeCrumbs,
  postCrumbs,
  tourCrumbs
} from '@/shared/lib/seo/breadcrumbs';

describe('построение путей', () => {
  test('пост лежит в разделе «Интересное о Крыме»', () => {
    expect(postCrumbs('Пещерный город Эски-Кермен')).toEqual([
      { label: 'Главная', href: '/' },
      { label: 'Интересное о Крыме', href: '/posts' },
      { label: 'Пещерный город Эски-Кермен' }
    ]);
  });

  test('тур лежит в каталоге туров', () => {
    expect(tourCrumbs('Джип тур «Чуфут Кале»')[1]).toEqual({
      label: 'Все туры',
      href: '/tours'
    });
  });

  test('гид лежит в разделе «Гиды»', () => {
    // Раздела не существовало, пока не появился листинг `/guides` (E6):
    // до него путь обрывался на главной.
    expect(guideCrumbs('Иван Петров')).toEqual([
      HOME_CRUMB,
      { label: 'Гиды', href: '/guides' },
      { label: 'Иван Петров' }
    ]);
  });

  test('объект лежит в разделе «Места»', () => {
    expect(placeCrumbs('Мангуп-Кале')).toEqual([
      HOME_CRUMB,
      { label: 'Места', href: '/mesta' },
      { label: 'Мангуп-Кале' }
    ]);
  });

  test('гео-страница ведёт на посадочную джип-туров, а не в каталог', () => {
    // Путь в сниппете повторяет структуру раздела: запросу «джип тур Крым»
    // отвечает `/dzhip-tur-krym`, а не `/tours`.
    expect(geoCrumbs('Джип-туры из Бахчисарая')[1]).toEqual({
      label: 'Джип-туры',
      href: '/dzhip-tur-krym'
    });
  });

  test('текущая страница всегда без href', () => {
    const crumbs = postCrumbs('Мангуп-Кале');

    expect(crumbs[crumbs.length - 1].href).toBeUndefined();
  });

  test('длинный заголовок обрезается по границе слова', () => {
    const long =
      'Скульптурная композиция «Девушка Арзы и разбойник Али-Баба» и «Русалка» в Мисхоре';
    const [, , current] = postCrumbs(long);

    expect(current.label.length).toBeLessThanOrEqual(61);
    expect(current.label.endsWith('…')).toBe(true);
    expect(current.label).not.toMatch(/[\s,]…$/);
  });

  test('короткий заголовок не трогается', () => {
    expect(postCrumbs('Мангуп').at(-1)).toEqual({ label: 'Мангуп' });
  });
});

describe('разметка BreadcrumbList', () => {
  const jsonLd = buildBreadcrumbJsonLd(postCrumbs('Мангуп-Кале'));

  test('это BreadcrumbList из schema.org', () => {
    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('BreadcrumbList');
  });

  test('позиции нумеруются с единицы и по порядку', () => {
    expect(jsonLd.itemListElement.map(item => item.position)).toEqual([
      1, 2, 3
    ]);
  });

  test('адреса абсолютные — относительные схема не принимает', () => {
    expect(jsonLd.itemListElement[0].item).toBe('https://energy-tur.ru');
    expect(jsonLd.itemListElement[1].item).toBe('https://energy-tur.ru/posts');
  });

  test('у текущей страницы item опущен', () => {
    expect(jsonLd.itemListElement[2]).not.toHaveProperty('item');
    expect(jsonLd.itemListElement[2].name).toBe('Мангуп-Кале');
  });

  test('имена в разметке совпадают с видимыми подписями', () => {
    const crumbs = tourCrumbs('Джип тур «Сердцем Крыма»');

    expect(
      buildBreadcrumbJsonLd(crumbs).itemListElement.map(i => i.name)
    ).toEqual(crumbs.map(c => c.label));
  });

  test('пустой путь даёт пустой список, а не сломанную разметку', () => {
    expect(buildBreadcrumbJsonLd([]).itemListElement).toEqual([]);
  });
});

/**
 * Три каталога остались без крошек, когда их ставили по сайту (C2): у `/tours`,
 * `/posts` и `/uslugi` своя шапка, и общий компонент их не задел. Проверка
 * по исходникам, а не по рендеру: отрисовать серверный `view` целиком —
 * значит поднять базу, а вопрос здесь один — выведены ли крошки вообще.
 */
describe('крошки в каталогах', () => {
  const CATALOGS = [
    { path: '/tours', file: 'src/views/tours/ui/layout.tsx' },
    { path: '/posts', file: 'src/views/posts/ui/layout.tsx' },
    { path: '/uslugi', file: 'src/views/legacy/ui/services-view.tsx' }
  ];

  test.each(CATALOGS)('$path выводит крошки', ({ file }) => {
    const source = readFileSync(join(process.cwd(), file), 'utf8');

    expect(source).toContain('sectionCrumbs(');
    expect(source).toMatch(/<Breadcrumbs|crumbs=\{/);
  });
});
