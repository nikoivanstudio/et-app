import { Heading, Html, Link, Section, Text } from '@react-email/components';
import * as React from 'react';

type Props = {
  authorName: string;
  tourTitle: string;
  /** Куда вернуться: страница заявки клиенту, кабинет — гиду. */
  threadUrl: string;
};

/**
 * Письмо о новом сообщении в переписке.
 *
 * Текст сообщения в письмо намеренно не попадает: почта — не защищённый
 * канал, а правило площадки (телефоны не передаются) действует только
 * внутри переписки. В письме — повод вернуться, не содержание.
 */
export function BookingMessageEmail({
  authorName,
  tourTitle,
  threadUrl
}: Props) {
  return (
    <Html lang='ru'>
      <Section>
        <Heading as='h2'>Новое сообщение по заявке</Heading>
        <Text>
          {authorName} написал вам в переписке по туру «{tourTitle}».
        </Text>
        <Text>
          Прочитать и ответить: <Link href={threadUrl}>{threadUrl}</Link>
        </Text>
      </Section>
    </Html>
  );
}
