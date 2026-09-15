import { Heading, Html, Link, Section, Text } from '@react-email/components';
import * as React from 'react';

type Props = {
  guestName: string;
  tourTitle: string;
  guideName: string;
  desiredDate?: string;
  peopleCount: number;
  /** Абсолютный адрес страницы заявки: по нему клиент возвращается в переписку. */
  bookingUrl: string;
};

/**
 * Письмо клиенту сразу после заявки.
 *
 * Его единственная задача — донести ссылку на заявку. До этого письма
 * адрес страницы показывался ровно один раз, в модалке после отправки:
 * закрыл вкладку — и переписка с гидом потеряна, а сам диалог идёт днями.
 */
export function BookingCreatedClientEmail({
  guestName,
  tourTitle,
  guideName,
  desiredDate,
  peopleCount,
  bookingUrl
}: Props) {
  return (
    <Html lang='ru'>
      <Section>
        <Heading as='h2'>Заявка принята</Heading>
        <Text>
          {guestName}, гид <b>{guideName}</b> получил вашу заявку на тур «
          {tourTitle}» и свяжется с вами.
        </Text>
        {!!desiredDate && (
          <Text>
            <b>Дата:</b> {desiredDate}
          </Text>
        )}
        <Text>
          <b>Гостей:</b> {peopleCount}
        </Text>
        <Text>
          Статус заявки и переписка с гидом — по этой ссылке:{' '}
          <Link href={bookingUrl}>{bookingUrl}</Link>
        </Text>
        <Text>
          Сохраните письмо: ссылка — единственный способ вернуться к переписке,
          если вы открываете сайт с другого устройства.
        </Text>
      </Section>
    </Html>
  );
}
