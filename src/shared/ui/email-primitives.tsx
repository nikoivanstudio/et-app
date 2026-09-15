import * as React from 'react';

/**
 * Примитивы для писем вместо `@react-email/components`.
 *
 * Пакет целиком помечен в npm как `Package no longer supported`, причём
 * последняя опубликованная версия (1.0.12) — тоже. Обновиться было некуда,
 * поэтому пять использованных примитивов переехали сюда.
 *
 * Разметка повторяет то, что отдавал сам пакет: секция — таблица с
 * `role="presentation"` (Outlook игнорирует `div` с раскладкой, а таблицу
 * рисует предсказуемо), стили — только инлайновые, потому что почтовые
 * клиенты вырезают `<style>`. Рендерит письма `@react-email/render` —
 * он не устарел и нужен `resend` как peer-зависимость.
 */

type Children = { children?: React.ReactNode };

export function Html({ children, lang = 'ru' }: Children & { lang?: string }) {
  return (
    <html dir='ltr' lang={lang}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width' />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#ffffff' }}>
        {children}
      </body>
    </html>
  );
}

export function Section({ children }: Children) {
  return (
    <table
      align='center'
      width='100%'
      border={0}
      cellPadding={0}
      cellSpacing={0}
      role='presentation'
    >
      <tbody>
        <tr>
          <td>{children}</td>
        </tr>
      </tbody>
    </table>
  );
}

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export function Heading({
  children,
  as: Tag = 'h1'
}: Children & { as?: HeadingLevel }) {
  return <Tag style={{ fontWeight: 'bold', margin: '16px 0' }}>{children}</Tag>;
}

export function Text({ children }: Children) {
  return (
    <p style={{ fontSize: 14, lineHeight: '24px', margin: '16px 0' }}>
      {children}
    </p>
  );
}

export function Link({ children, href }: Children & { href: string }) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      style={{ color: '#067df7', textDecoration: 'none' }}
    >
      {children}
    </a>
  );
}
