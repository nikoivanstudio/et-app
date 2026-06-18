import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { BecomePartnerForm } from '@/features/partner-application';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';

const cnBecomePartner = cn('BecomePartner');

export const BecomePartnerLayout: FC = () => (
  <main className={cnBecomePartner(null, ['px-4', 'pt-24', 'pb-16'])}>
    <div className='mx-auto max-w-2xl space-y-6'>
      <header className='space-y-2 text-center'>
        <h1>Стать партнёром</h1>
        <p className='text-muted-foreground'>
          Пожалуйста, внимательно ознакомьтесь с информацией ниже перед подачей
          заявки.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Информация для будущего партнёра</CardTitle>
          <CardDescription>
            Тестовый информационный блок — содержание будет уточнено позже.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4 text-sm leading-relaxed'>
          <p>
            Став партнёром компании, вы получаете доступ к инструментам для
            работы с турами и активностями. Гид создаёт и проводит собственные
            маршруты, реализатор продаёт туры компании и получает
            вознаграждение за каждую продажу.
          </p>
          <p>
            Перед началом работы необходимо ознакомиться с правилами компании,
            требованиями к качеству обслуживания и порядком расчётов. Вы
            обязуетесь предоставлять достоверную информацию о себе и
            оказываемых услугах.
          </p>
          <p>
            После подачи заявки она поступает на рассмотрение администратору.
            Решение по заявке вы увидите в своём профиле. При одобрении вам
            будет назначена соответствующая роль и откроется доступ к
            возможностям партнёра.
          </p>
          <ul className='list-disc space-y-1 pl-5'>
            <li>Соблюдайте правила и стандарты компании.</li>
            <li>Предоставляйте только достоверные данные.</li>
            <li>Несите ответственность за качество оказываемых услуг.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Заявка на партнёрство</CardTitle>
          <CardDescription>
            Выберите тип партнёрства и подтвердите согласие.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BecomePartnerForm />
        </CardContent>
      </Card>
    </div>
  </main>
);
