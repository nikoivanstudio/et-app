import { Globe, MapPin, Upload, Users } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/css';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

import { GuideDashboardShellTemplate } from './guide-dashboard-shell';

type GuideProfilePageTemplateProps = {
  tab?: 'info' | 'team';
};

export function GuideProfilePageTemplate({
  tab = 'info'
}: GuideProfilePageTemplateProps) {
  return (
    <GuideDashboardShellTemplate
      activeItem='profile'
      title='Профиль организатора'
      subtitle='Шаблон экрана профиля по мотивам исходного интерфейса: информация, карта, логотип и ссылки.'
      actions={<Button className='rounded-xl'>Сохранить</Button>}
    >
      <div className='space-y-6'>
        <div className='flex flex-wrap gap-2'>
          {[
            { id: 'info', label: 'Информация' },
            { id: 'team', label: 'Команда' }
          ].map((item) => (
            <Button
              key={item.id}
              variant={tab === item.id ? 'default' : 'ghost'}
              className={cn('rounded-xl', tab !== item.id && 'text-muted-foreground')}
            >
              {item.label}
            </Button>
          ))}
        </div>

        {tab === 'info' ? (
          <Card className='rounded-3xl border-border/60 bg-card/70'>
            <CardContent className='space-y-8 pt-6'>
              <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]'>
                <div className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <Field label='Название'>
                      <Input defaultValue='Спортивный клуб "Экстрим-Спорт"' />
                    </Field>
                    <Field label='Категория'>
                      <Input defaultValue='Спортивный клуб' />
                    </Field>
                    <Field label='Ваш ИНН'>
                      <Input defaultValue='12 цифр...' />
                    </Field>
                    <Field label='Базовая валюта'>
                      <Input defaultValue='Российский рубль' />
                    </Field>
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <Field label='Где вы находитесь?'>
                      <Input defaultValue='Бахчисарай' />
                    </Field>
                    <Field label='Адрес'>
                      <Input defaultValue='ул. Фрунзе 95' />
                    </Field>
                  </div>

                  <Field label='Краткое описание деятельности и услуг'>
                    <Textarea
                      className='min-h-32'
                      defaultValue='Проводим джип-туры и экскурсии по Крыму, работаем с индивидуальными заявками и небольшими группами.'
                    />
                  </Field>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <Field label='Сайт'>
                      <div className='relative'>
                        <Globe className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
                        <Input className='pl-9' defaultValue='http://' />
                      </div>
                    </Field>
                    <Field label='Страница ВКонтакте'>
                      <Input defaultValue='https://vk.com/jeepoturcrimea' />
                    </Field>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='rounded-3xl border border-border/60 bg-background/50 p-4'>
                    <p className='text-sm font-medium'>Логотип / Аватар</p>
                    <div className='mt-4 flex items-center gap-4'>
                      <div className='size-20 rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_30%,_rgba(250,204,21,0.5),_transparent_35%),linear-gradient(135deg,_#475569,_#111827)]' />
                      <Button variant='outline' className='rounded-xl'>
                        <Upload className='size-4' />
                        Выберите файл
                      </Button>
                    </div>
                  </div>

                  <div className='rounded-3xl border border-border/60 bg-background/50 p-4'>
                    <div className='flex items-center gap-2 text-sm font-medium'>
                      <MapPin className='size-4 text-primary' />
                      Расположение на карте
                    </div>
                    <div className='mt-4 h-64 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.18),_transparent_28%),radial-gradient(circle_at_70%_70%,_rgba(16,185,129,0.15),_transparent_24%),linear-gradient(180deg,_#1f2937,_#0f172a)]' />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className='rounded-3xl border-dashed border-border/60 bg-card/60 py-12'>
            <CardContent className='text-center'>
              <div className='mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/12'>
                <Users className='size-7 text-primary' />
              </div>
              <h3 className='mt-5 text-xl font-semibold'>Команда</h3>
              <p className='mt-2 text-sm text-muted-foreground'>
                Заглушка под экран команды: участники, роли, доступы, контакты.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </GuideDashboardShellTemplate>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className='space-y-2'>
      <span className='text-sm font-medium'>{label}</span>
      {children}
    </label>
  );
}
