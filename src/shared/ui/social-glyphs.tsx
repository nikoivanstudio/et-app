import { FC, SVGProps } from 'react';

/**
 * Монохромные значки соцсетей.
 *
 * Старые `VkIcon`, `MaxIcon`, `RutubeIcon` и `TelegrammIcon` — растровые
 * паттерны и градиенты внутри SVG: перекрасить их нельзя, и в подвале они
 * давали четыре разноцветных пятна — единственный цвет на всём сайте вне
 * фотографий. Здесь один путь на значок и `currentColor`, так что цвет
 * задаёт место, куда значок поставили.
 */
type GlyphProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true as const
});

export const TelegramGlyph: FC<GlyphProps> = ({ size = 18, ...props }) => (
  <svg {...base(size)} {...props}>
    <path d='M21.9 4.3 2.9 11.6c-1 .4-1 1 0 1.3l4.6 1.4 1.7 5.3c.2.6.5.7 1 .3l2.6-2.1 4.6 3.4c.6.4 1 .2 1.2-.5l3-14c.2-.8-.3-1.2-1.1-.9zM8.9 14l8.6-5.4c.4-.2.7 0 .4.3l-7 6.3-.3 3.2L8.9 14z' />
  </svg>
);

export const MaxGlyph: FC<GlyphProps> = ({ size = 18, ...props }) => (
  <svg {...base(size)} {...props}>
    <path d='M12 2.4c-5.3 0-9.1 3.7-9.1 8.8 0 2.1.7 4 1.9 5.6v2.8c0 .9 1 1.4 1.7.9l2.6-1.9c.9.2 1.9.4 2.9.4 5.3 0 9.1-3.7 9.1-8.8S17.3 2.4 12 2.4zm0 3c3.4 0 5.7 2.1 5.7 4.8 0 3-2.3 5.4-5.7 5.4-.9 0-1.7-.2-2.5-.5a.9.9 0 0 0-.8.1l-.5.4v-.7a.9.9 0 0 0-.2-.6 5.2 5.2 0 0 1-1.5-3.5c0-3 2.3-5.4 5.5-5.4z' />
  </svg>
);

export const VkGlyph: FC<GlyphProps> = ({ size = 18, ...props }) => (
  <svg {...base(size)} {...props}>
    <path d='M12.8 17.3c-5.4 0-8.8-3.8-8.9-10.1h2.8c.1 4.7 2.2 6.7 3.8 7.1V7.2h2.6v4.1c1.5-.2 3.1-1.9 3.6-4.1h2.6c-.4 2.8-2.1 4.5-3.2 5.2 1.1.6 3 2 3.7 4.9h-2.9c-.6-1.9-2-3.4-3.8-3.6v3.6h-.3z' />
  </svg>
);

export const VideoGlyph: FC<GlyphProps> = ({ size = 18, ...props }) => (
  <svg {...base(size)} {...props}>
    <path d='M3.5 5h17A1.5 1.5 0 0 1 22 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 17.5v-11A1.5 1.5 0 0 1 3.5 5zm6.3 3.4v7.2l6-3.6-6-3.6z' />
  </svg>
);

export const MailGlyph: FC<GlyphProps> = ({ size = 18, ...props }) => (
  <svg
    {...base(size)}
    {...props}
    fill='none'
    stroke='currentColor'
    strokeWidth={1.7}
    strokeLinecap='round'
  >
    <rect x='2.5' y='5' width='19' height='14' rx='2.5' />
    <path d='m3 7 9 6 9-6' />
  </svg>
);

/**
 * WhatsApp (A7).
 *
 * Значка не было: канал был закомментирован в константах контактов,
 * хотя в нише по нему пишут чаще, чем звонят.
 */
export const WhatsAppGlyph: FC<GlyphProps> = ({ size = 18, ...props }) => (
  <svg {...base(size)} {...props}>
    <path d='M12 2a9.9 9.9 0 0 0-8.5 15l-1.4 5.1 5.2-1.4A9.9 9.9 0 1 0 12 2zm0 1.9a8 8 0 0 1 6.7 12.4 8 8 0 0 1-10.4 2.6l-.4-.2-3 .8.8-2.9-.2-.4A8 8 0 0 1 12 3.9zm-3.6 4c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.2.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.3-1.7-.8c-.2-.1-.4-.2-.6.1l-.8 1c-.2.2-.3.2-.5.1a6.5 6.5 0 0 1-3.3-2.9c-.2-.4 0-.5.1-.7l.4-.5.3-.5v-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4z' />
  </svg>
);
