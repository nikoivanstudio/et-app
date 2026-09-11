import {
  buildDescription,
  DESCRIPTION_MAX_LENGTH,
  getPlainText,
  truncate
} from '@/shared/lib/seo/description';

describe('getPlainText', () => {
  test('снимает теги и схлопывает пробелы', () => {
    expect(getPlainText('<p>Мангуп</p>\n<p>  Кале </p>')).toBe('Мангуп Кале');
  });

  test('теги заменяются пробелом, слова не слипаются', () => {
    expect(getPlainText('<b>Чуфут</b><i>Кале</i>')).toBe('Чуфут Кале');
  });

  test('выкидывает script и style вместе с содержимым', () => {
    expect(getPlainText('<style>.a{color:red}</style><p>Текст</p>')).toBe(
      'Текст'
    );
  });

  test('раскрывает сущности, которые встречаются в легаси-текстах', () => {
    expect(getPlainText('<p>Фонтан&nbsp;&laquo;Ночь&raquo;&mdash;Бахчисарай</p>'))
      .toBe('Фонтан «Ночь»—Бахчисарай');
  });

  test('раскрывает числовые сущности', () => {
    expect(getPlainText('&#1050;рым')).toBe('Крым');
  });
});

describe('truncate', () => {
  test('короткую строку не трогает', () => {
    expect(truncate('Джип-тур на Мангуп')).toBe('Джип-тур на Мангуп');
  });

  test('режет по границе слова и добавляет многоточие', () => {
    const value = `${'слово '.repeat(40)}конец`;
    const result = truncate(value);

    expect(result.length).toBeLessThanOrEqual(DESCRIPTION_MAX_LENGTH + 1);
    expect(result.endsWith('…')).toBe(true);
    expect(result).not.toMatch(/сло…$/);
  });

  test('убирает висящую пунктуацию перед многоточием', () => {
    const value = `${'а'.repeat(150)} , хвост`;

    expect(truncate(value)).not.toMatch(/[\s,]…$/);
  });

  test('режет жёстко, если пробела нет', () => {
    const value = 'я'.repeat(300);

    expect(truncate(value)).toHaveLength(DESCRIPTION_MAX_LENGTH + 1);
  });
});

describe('buildDescription', () => {
  test('заполненное описание возвращается как есть', () => {
    expect(buildDescription('Джип-тур на Мангуп-Кале из Бахчисарая')).toBe(
      'Джип-тур на Мангуп-Кале из Бахчисарая'
    );
  });

  test('литерал «description» заглушкой не считается описанием', () => {
    expect(buildDescription('description', '<p>Пещерный город Эски-Кермен</p>'))
      .toBe('Пещерный город Эски-Кермен');
  });

  test('заглушка распознаётся без учёта регистра и пробелов', () => {
    expect(buildDescription('  Description  ', '<p>Текст страницы</p>')).toBe(
      'Текст страницы'
    );
  });

  test('пустое описание берётся из контента', () => {
    expect(buildDescription('', '<p>Экскурсия в Чуфут-Кале</p>')).toBe(
      'Экскурсия в Чуфут-Кале'
    );
  });

  test('null и undefined обрабатываются как пустые', () => {
    expect(buildDescription(null, '<p>Текст</p>')).toBe('Текст');
    expect(buildDescription(undefined, undefined)).toBe('');
  });

  test('без описания и без контента возвращает пустую строку', () => {
    expect(buildDescription('description', '')).toBe('');
    expect(buildDescription('description', '<p>   </p>')).toBe('');
  });

  test('описание из контента укладывается в лимит сниппета', () => {
    const content = `<p>${'Крым '.repeat(100)}</p>`;
    const result = buildDescription(null, content);

    expect(result.length).toBeLessThanOrEqual(DESCRIPTION_MAX_LENGTH + 1);
  });

  test('никогда не возвращает литерал-заглушку', () => {
    expect(buildDescription('description', 'description')).toBe('');
  });
});
