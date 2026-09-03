import sanitizeHtml from 'sanitize-html';

/**
 * Санитизация HTML перед выводом через dangerouslySetInnerHTML (MED-3).
 *
 * Контент постов и материалов, перенесённых с прежнего сайта WordPress
 * (migration.json, 8 МБ), выводился в разметку без какой-либо очистки.
 * Достаточно было одного тега script или атрибута onerror в этих данных,
 * чтобы получить исполнение кода в контексте домена.
 *
 * Подход — allowlist: разрешено только то, что перечислено явно. Всё
 * остальное, включая script, iframe, style, form и любые обработчики
 * событий (on*), удаляется.
 */

/** Разметка статей: заголовки, списки, таблицы, изображения, ссылки. */
const articleOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'br',
    'hr',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'sup',
    'sub',
    'blockquote',
    'ul',
    'ol',
    'li',
    'dl',
    'dt',
    'dd',
    'a',
    'img',
    'figure',
    'figcaption',
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'th',
    'td',
    'caption',
    'colgroup',
    'col',
    'span',
    'div',
    'code',
    'pre'
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
    th: ['colspan', 'rowspan', 'scope'],
    td: ['colspan', 'rowspan'],
    col: ['span', 'width'],
    '*': ['class']
  },
  // Только безопасные схемы: javascript: и data: для ссылок исключены
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: {
    img: ['http', 'https']
  },
  allowProtocolRelative: false,
  // Внешние ссылки не должны получать доступ к window.opener
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' })
  },
  // Содержимое запрещённых тегов выбрасывается целиком, а не «разворачивается»
  nonTextTags: ['style', 'script', 'textarea', 'option', 'noscript', 'iframe']
};

/** Очистка содержимого статей и постов. */
export const sanitizeArticleHtml = (html: string): string =>
  sanitizeHtml(html, articleOptions);
