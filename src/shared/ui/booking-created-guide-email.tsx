import { Heading, Html, Link, Section, Text } from '@react-email/components';
import * as React from 'react';

type Props = {
  guestName: string;
  guestPhone: string;
  tourTitle: string;
  desiredDate?: string;
  peopleCount: number;
  comment?: string;
  /** Абсолютный адрес кабинета: заявки лежат там. */
  dashboardUrl: string;
};

/**
 * Письмо гиду о новой заявке. Без него новая заявка видна только тому,
 * кто в этот момент держит кабинет открытым: список опрашивается раз
 * в тридцать секунд, но никто не сидит в нём сутками.
 */
export function BookingCreatedGuideEmail({
  guestName,
  guestPhone,
  tourTitle,
  desiredDate,
  peopleCount,
  comment,
  dashboardUrl
}: Props) {
  return (
    <Html lang='ru'>
      <Section>
        <Heading as='h2'>Новая заявка на тур</Heading>
        <Text>
          <b>Тур:</b> {tourTitle}
        </Text>
        <Text>
          <b>Клиент:</b> {guestName}
        </Text>
        <Text>
          <b>Телефон:</b> {guestPhone}
        </Text>
        {!!desiredDate && (
          <Text>
            <b>Дата:</b> {desiredDate}
          </Text>
        )}
        <Text>
          <b>Гостей:</b> {peopleCount}
        </Text>
        {!!comment && (
          <Text>
            <b>Комментарий:</b> {comment}
          </Text>
        )}
        <Text>
          Обработать заявку: <Link href={dashboardUrl}>{dashboardUrl}</Link>
        </Text>
      </Section>
    </Html>
  );
}
