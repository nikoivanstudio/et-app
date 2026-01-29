import type { Metadata } from 'next';
import { Caladea, Oswald, Poiret_One } from 'next/font/google';

import { AppProvider } from '@/shared/lib/providers/app-provider';
import { cn } from '@/shared/lib/css';

import './globals.css';
import { Toaster } from 'sonner';

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
  metadataBase: new URL('https://energy-tur.ru'),

  title: {
    default: 'Джип туры и индивидуальные экскурсии по Крыму — Energy Tour',
    template: '%s | Energy Tour'
  },

  description:
    'Джип туры и индивидуальные экскурсии по Крыму в 2026 году. Бахчисарай, Ялта, Севастополь. Организация отдыха под ключ. Лучшие цены +7 (978) 788-07-53',

  alternates: {
    canonical: '/'
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large'
    }
  },

  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://energy-tur.ru',
    siteName: 'Energy Tour',
    title: 'Джип туры и индивидуальные экскурсии по Крыму — Energy Tour',
    description:
      'Лучшие экскурсии и джип туры по Крыму. Индивидуальные маршруты. Бахчисарай, Ялта, Севастополь.',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Energy Tour Крым'
      }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru' suppressHydrationWarning>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TouristInformationCenter',
            name: 'Energy Tour',
            url: 'https://energy-tur.ru',
            telephone: '+79787880753',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'RU',
              addressRegion: 'Крым'
            }
          })
        }}
      />
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
