import { CONTACTS } from '@/widgets/contacts/constants/contacts';

import {
  absoluteUrl,
  SITE_LOGO,
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
 * а выдуманные в разметке хуже отсутствующих.
 *
 * `logo` появился после переезда файла в `public/` (C1): раньше логотип
 * лежал импортом модуля и получал хешированный путь, который менялся
 * от сборки к сборке. Для карточки организации это ключевое поле —
 * по нему картинка попадает в панель знаний, — и непостоянный адрес
 * в нём хуже, чем его отсутствие.
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
  // `ImageObject`, а не строка: с размерами поисковик знает пропорции,
  // не скачивая файл, и не обрезает логотип под свою сетку.
  logo: {
    '@type': 'ImageObject',
    url: absoluteUrl(SITE_LOGO.path),
    width: SITE_LOGO.width,
    height: SITE_LOGO.height
  },
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
  // `filter` не для красоты: карточка в Яндекс.Бизнесе (G4) ждёт адреса
  // из кабинета, и пустая строка в `sameAs` — это ссылка на корень
  // сайта, то есть заявление «организация — это мы же».
  sameAs: [
    CONTACTS.telegram,
    CONTACTS.vk,
    CONTACTS.ruTube,
    CONTACTS.max,
    CONTACTS.yandexUslugi,
    CONTACTS.yandexBusiness
  ].filter(Boolean)
});
