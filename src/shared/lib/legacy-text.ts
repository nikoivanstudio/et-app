/**
 * Разбор текста, перенесённого из WordPress, на абзацы и списки.
 *
 * В базе и в константах он лежит одной строкой с переносами: «•» и «-» в
 * начале строки вместо списков, «1.» вместо нумерации. В разметке переносы
 * схлопываются, и страница показывала сплошной абзац на 40–50 строк — этот
 * шов был виден на /dzhip-tur-krym, /ekskursii-po-krymu и всех услугах.
 *
 * Куски, где разметка уже есть (таблицы, ul, img), остаются как были.
 */

const BLOCK_TAG = /^\s*<(p|ul|ol|table|h[1-6]|div|img|figure|blockquote)\b/i;
const BULLET = /^\s*[•\-–—]\s+/;
const NUMBER = /^\s*\d+\.\s+/;

const wrapList = (items: string[], ordered: boolean): string =>
  `<${ordered ? 'ol' : 'ul'}>${items
    .map(item => `<li>${item}</li>`)
    .join('')}</${ordered ? 'ol' : 'ul'}>`;

/** Один абзац исходника → абзац, список или та же разметка без изменений. */
const renderBlock = (block: string): string => {
  const trimmed = block.trim();

  if (!trimmed) return '';
  if (BLOCK_TAG.test(trimmed)) return trimmed;

  const lines = trimmed.split('\n').filter(line => !!line.trim());
  const bullets = lines.filter(line => BULLET.test(line));
  const numbers = lines.filter(line => NUMBER.test(line));

  // Маркеры собираем в список только когда ими помечено большинство строк:
  // иначе тире внутри предложения превращало абзац в одноэлементный список.
  if (bullets.length && bullets.length >= lines.length - 1) {
    const intro = lines.filter(line => !BULLET.test(line));

    return (
      intro.map(line => `<p>${line.trim()}</p>`).join('') +
      wrapList(
        bullets.map(line => line.replace(BULLET, '').trim()),
        false
      )
    );
  }

  if (numbers.length > 1 && numbers.length >= lines.length - 1) {
    const intro = lines.filter(line => !NUMBER.test(line));

    return (
      intro.map(line => `<p>${line.trim()}</p>`).join('') +
      wrapList(
        numbers.map(line => line.replace(NUMBER, '').trim()),
        true
      )
    );
  }

  // Строки внутри блока в выгрузке WordPress — это абзацы: склеенные через
  // <br /> они читались одной плитой на 20 строк.
  return lines.map(line => `<p>${line.trim()}</p>`).join('');
};

/** «<li>-В машине 6 мест» — дефис-маркер внутри готового списка. */
const stripListDashes = (html: string): string =>
  html.replace(/<li>\s*[-–—]\s*/gi, '<li>');

export const legacyTextToHtml = (source: string): string =>
  stripListDashes(source)
    .split(/\n{2,}/)
    .map(renderBlock)
    .filter(Boolean)
    .join('\n');
