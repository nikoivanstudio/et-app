import {
  buildBreadcrumbJsonLd,
  guideCrumbs,
  HOME_CRUMB,
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

  test('у гида промежуточного раздела нет — листинга гидов не существует', () => {
    expect(guideCrumbs('Иван Петров')).toEqual([
      HOME_CRUMB,
      { label: 'Иван Петров' }
    ]);
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
    expect(jsonLd.itemListElement.map(item => item.position)).toEqual([1, 2, 3]);
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

    expect(buildBreadcrumbJsonLd(crumbs).itemListElement.map(i => i.name)).toEqual(
      crumbs.map(c => c.label)
    );
  });

  test('пустой путь даёт пустой список, а не сломанную разметку', () => {
    expect(buildBreadcrumbJsonLd([]).itemListElement).toEqual([]);
  });
});
