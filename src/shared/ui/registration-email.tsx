import { Heading, Html, Section, Text } from '@react-email/components';
import * as React from 'react';

type Props = {
  code: string;
};

export function RegistrationEmail({ code }: Props) {
  return (
    <Html lang='ru'>
      <Section>
        <Heading as='h2'>Регистрация на сайте Energy-Tour</Heading>
        <Text>
          <b>{code} - </b>ваш код подтверждения регистрации на сайте
          https://energy-tur.ru/
        </Text>
      </Section>
    </Html>
  );
}
