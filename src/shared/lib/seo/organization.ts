import { CONTACTS } from '@/widgets/contacts/constants/contacts';

import {
  absoluteUrl,
  SITE_NAME,
  SITE_URL
} from '@/shared/constants/site-constants';

/**
 * Схема организации.
 *
 * Раньше она жила прямо в `shared/lib/providers/app-provider.tsx` и потому
 * выводилась на каждой странице сайта — включая справочные статьи про
 * пещеры и дворцы. Организация описывает сайт целиком, её место — главная
 * и контакты; на остальных страницах должна быть схема самой страницы
 * (`Product` у тура, `Article` у статьи, `BreadcrumbList` везде).
 *
 * Тип сменён с `TouristInformationCenter` на `TravelAgency`: первый — это
 * туристско-информационный центр, справочная служба. Energy Tour продаёт
 * и организует туры, а это ровно `TravelAgency`.
 *
 * Чего здесь сознательно нет: `openingHours` и `geo` — точных данных нет,
 * а выдуманные в разметке хуже отсутствующих. `logo` — логотип лежит
 * импортом модуля и получает хешированный путь, стабильного абсолютного
 * адреса под него пока не существует.
 */
export const buildOrganizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  // Постоянный идентификатор: по нему другие схемы на сайте смогут
  // ссылаться на организацию, не повторяя её описание.
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  image: absoluteUrl('/opengraph-image'),
  description:
    'Джип-туры и индивидуальные экскурсии по Крыму с выездом из Бахчисарая, Севастополя и Ялты.',
  telephone: CONTACTS.phones[0],
  email: CONTACTS.email,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'RU',
    addressRegion: 'Республика Крым',
    addressLocality: 'Бахчисарай'
  },
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Крым'
  },
  contactPoint: CONTACTS.phones.map(phone => ({
    '@type': 'ContactPoint',
    telephone: phone,
    contactType: 'customer service',
    availableLanguage: 'Russian'
  })),
  sameAs: [CONTACTS.telegram, CONTACTS.vk, CONTACTS.ruTube, CONTACTS.max]
});
