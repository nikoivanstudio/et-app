import { CONTACTS } from '@/widgets/contacts/constants/contacts';

import { buildOrganizationJsonLd } from '@/shared/lib/seo/organization';

describe('схема организации', () => {
  const schema = buildOrganizationJsonLd();

  test('тип — TravelAgency, а не справочная служба', () => {
    // Было TouristInformationCenter — туристско-информационный центр.
    // Energy Tour продаёт и организует туры.
    expect(schema['@type']).toBe('TravelAgency');
  });

  test('у организации есть постоянный идентификатор', () => {
    expect(schema['@id']).toBe('https://energy-tur.ru/#organization');
  });

  test('адрес содержит город и регион, а не только страну', () => {
    expect(schema.address).toEqual({
      '@type': 'PostalAddress',
      addressCountry: 'RU',
      addressRegion: 'Республика Крым',
      addressLocality: 'Бахчисарай'
    });
  });

  test('телефоны берутся из констант контактов, а не дублируются строкой', () => {
    expect(schema.telephone).toBe(CONTACTS.phones[0]);
    expect(schema.contactPoint).toHaveLength(CONTACTS.phones.length);
    expect(schema.contactPoint.map(point => point.telephone)).toEqual(
      CONTACTS.phones
    );
  });

  test('соцсети перечислены в sameAs', () => {
    expect(schema.sameAs).toContain(CONTACTS.telegram);
    expect(schema.sameAs).toContain(CONTACTS.vk);
  });

  test('картинка — абсолютный адрес', () => {
    expect(schema.image).toBe('https://energy-tur.ru/opengraph-image');
  });

  test('нет выдуманных часов работы и координат', () => {
    // Данных нет, а выдуманные в разметке хуже отсутствующих.
    expect(schema).not.toHaveProperty('openingHours');
    expect(schema).not.toHaveProperty('openingHoursSpecification');
    expect(schema).not.toHaveProperty('geo');
  });
});
