import './globals.css';

import type { Metadata } from 'next';
import { Caladea, Oswald, Poiret_One } from 'next/font/google';
import { Toaster } from 'sonner';

import { SITE_URL } from '@/shared/constants/site-constants';
import { cn } from '@/shared/lib/css';
import { AppProvider } from '@/shared/lib/providers/app-provider';

const oswald = Oswald({
  weight: ['400'],
  variable: '--oswald',
  subsets: ['cyrillic']
});

const poireOne = Poiret_One({
  weight: ['400'],
  variable: '--font-poire-one',
  subsets: ['latin']
});

const caladea = Caladea({
  weight: ['400', '700'],
  variable: '--caladea',
  subsets: ['latin']
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'Джип туры и индивидуальные экскурсии по Крыму — Energy Tour',
    template: '%s | Energy Tour'
  },

  description:
    'Джип туры и индивидуальные экскурсии по Крыму в 2026 году. Бахчисарай, Ялта, Севастополь. Организация отдыха под ключ. Лучшие цены +7 (978) 788-07-53',

  // Здесь НЕТ ни `alternates`, ни `openGraph`, и это осознанно.
  //
  // Метаданные в Next наследуются вниз по дереву сегментов, поэтому бывший
  // тут `alternates.canonical: '/'` объявлял канонической копией главной
  // каждую страницу сайта, а `openGraph` главной подставлял её og:title и
  // og:url всем остальным. Оба поля задаются посегментно — через
  // `buildPageMetadata` (src/shared/lib/seo/page-metadata.ts).
  //
  // Картинка для соцсетей приходит из файловой конвенции
  // `src/app/opengraph-image.tsx` — прежний openGraph.images ссылался на
  // /og.jpg, которого в public/ нет и никогда не было.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large'
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru' suppressHydrationWarning>
      <body
        className={cn(
          oswald.variable,
          poireOne.variable,
          caladea.variable,
          'antialiased',
          'relative',
          'et-app'
        )}
      >
        <AppProvider>{children}</AppProvider>
        <Toaster richColors position='top-right' />
      </body>
    </html>
  );
}
