import { v4 } from 'uuid';

export function formatNumber(value: string): string {
  return value.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '$1-$2-$3-$4-$5');
}

export function translit(word: string): string {
  let answer = '';
  const converter: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'c',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ь: '',
    ы: 'y',
    ъ: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',

    А: 'A',
    Б: 'B',
    В: 'V',
    Г: 'G',
    Д: 'D',
    Е: 'E',
    Ё: 'E',
    Ж: 'Zh',
    З: 'Z',
    И: 'I',
    Й: 'Y',
    К: 'K',
    Л: 'L',
    М: 'M',
    Н: 'N',
    О: 'O',
    П: 'P',
    Р: 'R',
    С: 'S',
    Т: 'T',
    У: 'U',
    Ф: 'F',
    Х: 'H',
    Ц: 'C',
    Ч: 'Ch',
    Ш: 'Sh',
    Щ: 'Sch',
    Ь: '',
    Ы: 'Y',
    Ъ: '',
    Э: 'E',
    Ю: 'Yu',
    Я: 'Ya'
  };

  for (let i = 0; i < word.length; ++i) {
    if (converter[word[i]] == undefined) {
      answer += word[i];
    } else {
      answer += converter[word[i]];
    }
  }

  return answer;
}

export function getUniqName(name: string): string {
  return `${v4()}-${name}`;
}

/**
 * Цена рублями с разделителями разрядов: 8000 → «8 000 ₽».
 *
 * Одно форматирование на весь сайт: до этого `Intl.NumberFormat('ru-RU')`
 * вызывался по месту в карточке тура, а в остальных списках цена
 * печаталась как есть — «8000₽» рядом с «8 000 ₽» на соседних блоках.
 */
export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
}
