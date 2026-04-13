import {
  CalendarRange,
  CheckCircle2,
  CircleAlert,
  ImagePlus,
  MapPin,
  Minus,
  Plus
} from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/css';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

import { editorGallery, editorSections } from './data';
import { GuideDashboardShellTemplate } from './guide-dashboard-shell';

type SectionId = (typeof editorSections)[number]['id'];

type GuideTourEditorPageTemplateProps = {
  section?: SectionId;
};

export function GuideTourEditorPageTemplate({
  section = 'settings'
}: GuideTourEditorPageTemplateProps) {
  return (
    <GuideDashboardShellTemplate
      activeItem='tour-editor'
      title='Мои туры / Пещерный город Эски Кермен. Джип-экскурсия'
      subtitle='Шаблон страницы создания и редактирования тура с вкладками под все шаги.'
      actions={<Button className='rounded-xl'>Сохранить</Button>}
    >
      <div className='space-y-6'>
        <Card className='rounded-2xl border-emerald-500/20 bg-emerald-500/8 py-0'>
          <CardContent className='flex items-center justify-between gap-4 px-5 py-4'>
            <div>
              <p className='font-medium'>Тур включен и доступен для заказа</p>
              <p className='text-sm text-muted-foreground'>
                Верхний технический бар по аналогии с оригинальным редактором.
              </p>
            </div>
            <Badge className='bg-emerald-500/15 text-emerald-300'>Активен</Badge>
          </CardContent>
        </Card>

        <div className='flex flex-wrap gap-2'>
          {editorSections.map((item) => (
            <Button
              key={item.id}
              variant={section === item.id ? 'default' : 'ghost'}
              className={cn('rounded-xl', section !== item.id && 'text-muted-foreground')}
            >
              {item.label}
            </Button>
          ))}
        </div>

        {section === 'settings' ? <SettingsSection /> : null}
        {section === 'description' ? <DescriptionSection /> : null}
        {section === 'pricing' ? <PricingSection /> : null}
        {section === 'calendar' ? <CalendarSection /> : null}
        {section === 'photos' ? <PhotosSection /> : null}
        {section === 'meeting-point' ? <MeetingPointSection /> : null}
      </div>
    </GuideDashboardShellTemplate>
  );
}

function SettingsSection() {
  return (
    <SectionCard title='Шаг 1. Основные настройки' description='Последовательно и внимательно заполните все разделы.'>
      <div className='grid gap-4 lg:grid-cols-2'>
        <Field label='Текущий статус'>
          <div className='flex items-center gap-3'>
            <Badge className='bg-emerald-500/15 text-emerald-300'>Активен</Badge>
            <span className='text-sm text-muted-foreground'>
              Тур включен и доступен для заказа
            </span>
          </div>
        </Field>
        <Field label='Контактное лицо'>
          <Input defaultValue='Иван (+7 978 788 07 53)' />
        </Field>
      </div>

      <Field label='Название тура'>
        <Input defaultValue='Пещерный город Эски Кермен. Джип-экскурсия' />
      </Field>

      <div className='grid gap-4 lg:grid-cols-3'>
        <Field label='Базовая активность'>
          <Input defaultValue='Джиппинг' />
        </Field>
        <Field label='Доп. активность 1'>
          <Input defaultValue='Экскурсия' />
        </Field>
        <Field label='Доп. активность 2'>
          <Input defaultValue='На выходные' />
        </Field>
      </div>

      <Field label='Детали на сайте'>
        <Input placeholder='Укажите здесь ссылку на страницу вашего сайта...' />
      </Field>

      <div className='grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)]'>
        <Field label='Комиссия Турнадо'>
          <Input defaultValue='15%' />
        </Field>
        <div className='rounded-2xl border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground'>
          Для изменения процента свяжитесь с администрацией сайта.
        </div>
      </div>

      <div className='border-t border-border/60 pt-4 text-sm text-muted-foreground'>
        <p>Последняя правка 25.05.25 в 22:34</p>
        <div className='mt-3 flex flex-wrap gap-3'>
          <Button variant='ghost' className='rounded-xl px-0 text-sky-300 hover:text-sky-200'>
            Посмотреть на сайте
          </Button>
          <Button variant='ghost' className='rounded-xl px-0 text-amber-300 hover:text-amber-200'>
            Выключить
          </Button>
          <Button variant='ghost' className='rounded-xl px-0 text-destructive hover:text-destructive'>
            Удалить этот тур
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

function DescriptionSection() {
  return (
    <SectionCard title='Шаг 2. Описание' description='Подробно заполните все поля, чтобы клиенту было проще сделать выбор.'>
      <Field label='Что будет'>
        <Input defaultValue='Вы посетите один из самых старых пещерных городов на территории Крымского полуострова.' />
      </Field>

      <Field label='Описание / программа тура'>
        <Textarea
          className='min-h-56'
          defaultValue='Старт тура будет проходить в Бахчисарае. Место встречи оговаривается индивидуально. На маршруте будут видовые точки, древние укрепления и прогулка по пещерному городу.'
        />
      </Field>

      <div className='grid gap-4 lg:grid-cols-2'>
        <Field label='В стоимость включено'>
          <Textarea
            className='min-h-40'
            defaultValue='Аренда автомобиля, топливо, услуги инструктора, вход на музей, место в джипе, аренда снаряжения.'
          />
        </Field>
        <Field label='Дополнительные сервисы'>
          <Textarea
            className='min-h-40'
            defaultValue='Вход в пещерный город, организация обеда, расширенный маршрут, фотостопы по запросу.'
          />
        </Field>
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        <Field label='Моменты, факты'>
          <Textarea
            className='min-h-40'
            defaultValue='Количество пассажиров до 6 человек, техника Mitsubishi Pajero, билеты включены в стоимость тура.'
          />
        </Field>
        <Field label='Что взять с собой, снаряжение'>
          <Textarea
            className='min-h-40'
            defaultValue='Удобную обувь, одежду для активного отдыха, воду, головной убор и паспорт.'
          />
        </Field>
      </div>

      <Field label='Важная информация'>
        <Textarea
          className='min-h-36'
          defaultValue='Возможен старт из любой другой точки Крыма. Остановки производятся по согласованным местам, на маршруте предусмотрены смотровые площадки.'
        />
      </Field>
    </SectionCard>
  );
}

function PricingSection() {
  return (
    <SectionCard title='Шаг 3. Билеты и цены' description='Настройка валюты, длительности, участников и таблицы билетов.'>
      <div className='grid gap-4 lg:grid-cols-2 xl:grid-cols-4'>
        <Field label='Валюта цен тура'>
          <Input defaultValue='Российский рубль' />
        </Field>
        <Field label='Формирование цены'>
          <Input defaultValue='За группу' />
        </Field>
        <Field label='Дней до оплаты'>
          <Input defaultValue='3' />
        </Field>
        <Field label='Минимум участников'>
          <Input defaultValue='1' />
        </Field>
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        <div className='rounded-2xl border border-border/60 bg-background/40 p-4'>
          <p className='text-sm font-medium'>Управление длительностью и билетами</p>
          <div className='mt-4 flex flex-wrap gap-3'>
            <Badge variant='outline'>Длительность: 3 часа</Badge>
            <Badge variant='outline'>Билеты: за группу</Badge>
          </div>
          <p className='mt-3 text-sm text-muted-foreground'>
            Здесь оставлен блок под выбор нескольких вариантов продолжительности и типов билетов.
          </p>
        </div>
        <div className='rounded-2xl border border-border/60 bg-background/40 p-4'>
          <div className='flex items-start gap-3'>
            <CircleAlert className='mt-0.5 size-4 text-amber-300' />
            <p className='text-sm text-muted-foreground'>
              Важно: укажите свои обычные цены, комиссия сайта рассчитается автоматически.
            </p>
          </div>
        </div>
      </div>

      <div className='rounded-3xl border border-border/60 bg-background/50 p-5'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='font-medium'>Управление ценами билетов</p>
            <p className='text-sm text-muted-foreground'>
              По аналогии с оригинальным экраном здесь есть табличный блок с вариантами цен.
            </p>
          </div>
          <Badge className='bg-primary/15 text-primary'>Наценка Турнадо 5%</Badge>
        </div>

        <div className='mt-5 overflow-hidden rounded-2xl border border-border/60'>
          <div className='grid grid-cols-[1.4fr_1fr_1fr_120px] border-b border-border/60 bg-muted/30 px-4 py-3 text-xs uppercase tracking-[0.16em] text-muted-foreground'>
            <span>Тип билета</span>
            <span>Формат</span>
            <span>Длительность</span>
            <span className='text-right'>Цена</span>
          </div>
          {[
            ['Для любого кол-ва участников', 'За группу', '3 часа', '7 000 ₽'],
            ['Мини-группа до 4 чел.', 'За машину', '5 часов', '8 500 ₽'],
            ['Индивидуальный формат', 'Персонально', '7 часов', '12 000 ₽']
          ].map((row) => (
            <div
              key={row.join('-')}
              className='grid grid-cols-[1.4fr_1fr_1fr_120px] items-center border-b border-border/50 px-4 py-4 last:border-b-0'
            >
              <span>{row[0]}</span>
              <span className='text-muted-foreground'>{row[1]}</span>
              <span className='text-muted-foreground'>{row[2]}</span>
              <span className='text-right font-medium'>{row[3]}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function CalendarSection() {
  return (
    <SectionCard title='Шаг 4. Календарь' description='Заготовка под управление расписанием, слотами и исключениями.'>
      <div className='grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]'>
        <div className='rounded-3xl border border-border/60 bg-background/40 p-5'>
          <div className='flex items-center gap-2'>
            <CalendarRange className='size-4 text-primary' />
            <p className='font-medium'>Параметры календаря</p>
          </div>
          <div className='mt-4 space-y-4'>
            <Field label='Базовое время старта'>
              <Input defaultValue='10:00' />
            </Field>
            <Field label='Частота'>
              <Input defaultValue='Ежедневно' />
            </Field>
            <Field label='Окно бронирования'>
              <Input defaultValue='За 3 дня до начала' />
            </Field>
          </div>
        </div>

        <div className='rounded-3xl border border-border/60 bg-background/40 p-5'>
          <div className='grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.16em] text-muted-foreground'>
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <div key={day} className='py-2'>
                {day}
              </div>
            ))}
            {[
              1, 2, 3, 4, 5, 6, 7,
              8, 9, 10, 11, 12, 13, 14,
              15, 16, 17, 18, 19, 20, 21,
              22, 23, 24, 25, 26, 27, 28,
              29, 30, 31, 32, 33, 34, 35
            ].map((index) => (
              <div
                key={index}
                className={cn(
                  'rounded-xl border px-3 py-4 text-sm',
                  index === 11 || index === 18 || index === 26
                    ? 'border-primary/40 bg-primary/12 text-foreground'
                    : 'border-border/60 bg-card/50 text-muted-foreground'
                )}
              >
                {index}
              </div>
            ))}
          </div>
          <div className='mt-5 flex flex-wrap gap-2'>
            <Badge variant='outline'>Доступные даты</Badge>
            <Badge variant='outline'>Блокировки</Badge>
            <Badge variant='outline'>Переносы</Badge>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function PhotosSection() {
  return (
    <SectionCard title='Шаг 5. Фотографии' description='Блок выбора файлов и сетка карточек фотографий, как на исходном экране.'>
      <div className='rounded-3xl border border-dashed border-border/60 bg-background/40 p-5'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center'>
          <Button className='rounded-xl'>
            <ImagePlus className='size-4' />
            Выбрать фото
          </Button>
          <p className='text-sm text-muted-foreground'>
            Можно выбрать несколько фото, удерживая Shift или Ctrl.
          </p>
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {editorGallery.map((title, index) => (
          <div
            key={title}
            className='overflow-hidden rounded-3xl border border-border/60 bg-card/70'
          >
            <div
              className={cn(
                'h-48 border-b border-border/60',
                index % 3 === 0 &&
                  'bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.28),_transparent_35%),linear-gradient(135deg,_#4b5563,_#111827)]',
                index % 3 === 1 &&
                  'bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.26),_transparent_35%),linear-gradient(135deg,_#374151,_#0f172a)]',
                index % 3 === 2 &&
                  'bg-[radial-gradient(circle_at_top_left,_rgba(134,239,172,0.24),_transparent_35%),linear-gradient(135deg,_#3f3f46,_#111827)]'
              )}
            />
            <div className='space-y-4 p-4'>
              <div>
                <p className='font-medium'>{title}</p>
                <p className='mt-1 text-sm text-muted-foreground'>Короткое описание фотографии</p>
              </div>
              <div className='flex items-center justify-between gap-3'>
                <Button variant='ghost' className='rounded-xl px-0 text-sky-300 hover:text-sky-200'>
                  Сделать главной
                </Button>
                <div className='flex items-center gap-2'>
                  <Button variant='ghost' size='icon' className='size-8 rounded-lg'>
                    <Plus className='size-4' />
                  </Button>
                  <Button variant='ghost' size='icon' className='size-8 rounded-lg text-destructive'>
                    <Minus className='size-4' />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function MeetingPointSection() {
  return (
    <SectionCard title='Шаг 6. Точка старта' description='Карта, описание как добраться и список дополнительных городов встречи.'>
      <Field label='Город старта'>
        <Input defaultValue='Бахчисарай' />
      </Field>

      <div className='rounded-3xl border border-border/60 bg-[radial-gradient(circle_at_20%_20%,_rgba(16,185,129,0.18),_transparent_24%),radial-gradient(circle_at_60%_55%,_rgba(59,130,246,0.18),_transparent_28%),linear-gradient(180deg,_#1f2937,_#0f172a)] p-3'>
        <div className='flex h-[360px] items-center justify-center rounded-2xl border border-white/10 bg-black/10'>
          <div className='rounded-2xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-muted-foreground shadow-sm backdrop-blur'>
            Карта / точка старта / геопин
          </div>
        </div>
      </div>

      <Field label='Как добраться?'>
        <Textarea
          className='min-h-36'
          defaultValue='Один из самых частозадаваемых вопросов. Уточните, что будет ориентиром, где встречаете группу и какие варианты транспорта доступны.'
        />
      </Field>

      <div className='rounded-3xl border border-border/60 bg-background/40 p-5'>
        <div className='flex items-center gap-2'>
          <MapPin className='size-4 text-primary' />
          <p className='font-medium'>Дополнительные города встречи</p>
        </div>
        <div className='mt-4 space-y-3'>
          {['Симферополь', 'Бахчисарай', 'Танковое'].map((city) => (
            <div
              key={city}
              className='flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 px-4 py-3'
            >
              <span>{city}</span>
              <Button variant='ghost' size='icon' className='size-8 rounded-lg text-destructive'>
                <Minus className='size-4' />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function SectionCard({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className='rounded-3xl border-border/60 bg-card/70'>
      <CardContent className='space-y-6 pt-6'>
        <div>
          <div className='flex items-center gap-2'>
            <CheckCircle2 className='size-5 text-primary' />
            <h2 className='text-2xl font-semibold tracking-tight'>{title}</h2>
          </div>
          <p className='mt-2 max-w-3xl text-sm text-muted-foreground'>{description}</p>
        </div>
        {children}
      </CardContent>
    </Card>
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
