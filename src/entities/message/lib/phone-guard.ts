/**
 * Поиск телефона в тексте сообщения.
 *
 * Правило площадки: клиент и гид переписываются по заявке, но обменяться
 * номерами в переписке не могут — договорённость мимо площадки лишает её
 * и комиссии, и возможности разобрать спор. Телефон клиента гид получает
 * из самой заявки, это отдельный канал; здесь речь только о тексте писем.
 *
 * Ловится не «строка из одиннадцати цифр», а то, как номер пишут, когда
 * знают, что его ищут:
 *
 *   +7 978 123-45-67        — обычная запись;
 *   8(978)1234567           — без пробелов;
 *   восемь девятьсот        — словами;
 *   восемь9781234567        — вперемешку;
 *   +7 9О8 1з3 45 67        — буквами-двойниками вместо цифр;
 *   ٨٩٧٨...                 — не арабские цифры.
 *
 * Чего детектор не ловит и не должен: номер, разорванный осмысленными
 * словами («девять, потом семь, потом восемь»), и номер, отправленный
 * картинкой. Это задача уже не текстового фильтра.
 *
 * Даты и время из-под правила выведены: «приеду 12.09.2026» — обычная
 * фраза в переписке о туре, а цифр в ней восемь.
 */

/** Со скольких цифр подряд запись считается номером. */
const MIN_PHONE_DIGITS = 7;

/** Цифры словами. Падежи не разбираем: номер диктуют в именительном. */
const DIGIT_WORDS: Record<string, string> = {
  ноль: '0',
  нуль: '0',
  один: '1',
  одна: '1',
  два: '2',
  две: '2',
  три: '3',
  четыре: '4',
  пять: '5',
  шесть: '6',
  семь: '7',
  восемь: '8',
  девять: '9',
  десять: '10',
  одиннадцать: '11',
  двенадцать: '12',
  тринадцать: '13',
  четырнадцать: '14',
  пятнадцать: '15',
  шестнадцать: '16',
  семнадцать: '17',
  восемнадцать: '18',
  девятнадцать: '19',
  двадцать: '20',
  тридцать: '30',
  сорок: '40',
  пятьдесят: '50',
  шестьдесят: '60',
  семьдесят: '70',
  восемьдесят: '80',
  девяносто: '90',
  сто: '100',
  двести: '200',
  триста: '300',
  четыреста: '400',
  пятьсот: '500',
  шестьсот: '600',
  семьсот: '700',
  восемьсот: '800',
  девятьсот: '900',
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9'
};

/**
 * Буквы и знаки, которыми заменяют цифры. Подставляются только вторым
 * заходом и только там, где рядом уже есть настоящие цифры: иначе
 * безобидное «оооо» превращается в нули и попадает под правило.
 */
const LOOKALIKES: Record<string, string> = {
  о: '0',
  o: '0',
  О: '0',
  O: '0',
  о́: '0',
  з: '3',
  З: '3',
  б: '6',
  Б: '6',
  l: '1',
  i: '1',
  I: '1',
  і: '1',
  '|': '1',
  ч: '4',
  s: '5',
  S: '5',
  g: '9',
  q: '9'
};

/** Разделители внутри номера: их наличие запись не прерывает. */
const SEPARATORS = new Set([
  ' ',
  '\t',
  '\n',
  '\r',
  ' ',
  '-',
  '–',
  '—',
  '.',
  ',',
  '(',
  ')',
  '+',
  '/',
  '\\',
  '_',
  '*',
  '#',
  '[',
  ']'
]);

const isDigit = (char: string): boolean => char >= '0' && char <= '9';
const isLetter = (char: string): boolean => /[a-zа-яё]/i.test(char);

/** Цифры других письменностей и полноширинные — к обычным. */
const normalizeDigits = (text: string): string =>
  text.normalize('NFKC').replace(/[٠-٩۰-۹०-९]/g, char => {
    const code = char.codePointAt(0)!;
    const base = code >= 0x0966 ? 0x0966 : code >= 0x06f0 ? 0x06f0 : 0x0660;

    return String(code - base);
  });

type Run = { text: string; digits: string; realDigits: number };

/**
 * Разбор текста на «записи»: отрезки, внутри которых идут цифры, слова-цифры
 * и разделители. Любое другое слово запись обрывает.
 */
const collectRuns = (text: string, lookalikes: boolean): Run[] => {
  const runs: Run[] = [];
  let current: Run | null = null;
  let index = 0;

  const flush = () => {
    if (current && current.digits.length) runs.push(current);
    current = null;
  };

  const append = (raw: string, digits: string, real: boolean) => {
    current ??= { text: '', digits: '', realDigits: 0 };
    current.text += raw;
    current.digits += digits;
    if (real) current.realDigits += digits.length;
  };

  while (index < text.length) {
    const char = text[index];

    if (isDigit(char)) {
      append(char, char, true);
      index += 1;
      continue;
    }

    if (isLetter(char)) {
      const word = /^[a-zа-яё]+/i.exec(text.slice(index))![0];
      const digits = DIGIT_WORDS[word.toLowerCase()];

      if (digits) {
        append(word, digits, true);
      } else if (lookalikes && word.length === 1 && LOOKALIKES[word]) {
        append(word, LOOKALIKES[word], false);
      } else if (lookalikes && [...word].every(letter => LOOKALIKES[letter])) {
        append(
          word,
          [...word].map(letter => LOOKALIKES[letter]).join(''),
          false
        );
      } else {
        flush();
      }

      index += word.length;
      continue;
    }

    if (SEPARATORS.has(char)) {
      // «12000, 15000 или 18000» — перечисление, а не номер: запятую
      // с пробелом внутри номера не пишут ни в одной записи, зато так
      // пишут список цен, и раньше он целиком уезжал в блокировку.
      // Запятая без пробела разделителем остаётся: «8,978,123,45,67».
      if (char === ',' && /\s/.test(text[index + 1] ?? '')) {
        flush();
        index += 1;
        continue;
      }

      if (current !== null) {
        (current as Run).text += char;
      }
      index += 1;
      continue;
    }

    if (lookalikes && LOOKALIKES[char]) {
      append(char, LOOKALIKES[char], false);
      index += 1;
      continue;
    }

    flush();
    index += 1;
  }

  flush();

  return runs;
};

const DATE_LIKE = /^\d{1,2}\s*[.\-/]\s*\d{1,2}(\s*[.\-/]\s*\d{2,4})?$/;
const YEAR_LIKE = /^\d{4}$/;
/** «1 500 000» — сумма, а не номер: группы ровно по три цифры. */
const AMOUNT_LIKE = /^\d{1,3}(?:[  ]\d{3})+$/;

/** Обрамляющая пунктуация: «12.09.2026,» — та же дата. */
const trimEdges = (chunk: string): string =>
  chunk.replace(/^[^\d]+/, '').replace(/[^\d]+$/, '');

/**
 * Запись из одних дат, годов и сумм номером не считается.
 *
 * Послабление действует только для записей из цифр: номер, продиктованный
 * словами, состоит из чанков без единой цифры и иначе проходил бы насквозь.
 */
const isHarmless = (run: Run): boolean => {
  if (/[a-zа-яё]/i.test(run.text)) return false;

  const chunks = run.text
    .trim()
    .split(/[\s ]+/)
    .map(trimEdges)
    .filter(Boolean);

  if (chunks.every(chunk => DATE_LIKE.test(chunk) || YEAR_LIKE.test(chunk))) {
    return true;
  }

  return run.digits.length <= 9 && AMOUNT_LIKE.test(run.text.trim());
};

/**
 * Фрагмент, похожий на номер, либо null. Возвращается именно фрагмент —
 * он показывается автору сообщения, чтобы тот понял, что исправлять.
 */
export const findPhoneLike = (text: string): string | null => {
  if (!text) return null;

  const normalized = normalizeDigits(text);

  for (const lookalikes of [false, true]) {
    for (const run of collectRuns(normalized, lookalikes)) {
      if (run.digits.length < MIN_PHONE_DIGITS) continue;
      // Подстановка букв вместо цифр учитывается только там, где номер
      // уже наполовину написан цифрами.
      if (lookalikes && run.realDigits < 4) continue;
      if (isHarmless(run)) continue;

      return run.text.trim();
    }
  }

  return null;
};

export const containsPhoneLike = (text: string): boolean =>
  findPhoneLike(text) !== null;
