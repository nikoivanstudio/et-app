import { Heading, Html, Section, Text } from '@react-email/components';
import * as React from 'react';

export function CallbackEmail({
  name,
  phone,
  message,
  source
}: {
  name: string;
  phone: string;
  message?: string;
  /** Страница, с которой пришла заявка (A7). */
  source?: string;
}) {
  return (
    <Html lang='ru'>
      <Section>
        <Heading as='h2'>Заявка на обратный звонок</Heading>
        <Text>
          <b>Имя:</b> {name}
        </Text>
        <Text>
          <b>Телефон:</b> {phone}
        </Text>
        {message && (
          <Text>
            <b>Комментарий:</b> {message}
          </Text>
        )}
        {/* Источник: форма встала на все типы страниц (A7), и без него
            оператор не знает, о каком маршруте спрашивают. */}
        {source && (
          <Text>
            <b>Источник:</b> {source}
          </Text>
        )}
      </Section>
    </Html>
  );
}
