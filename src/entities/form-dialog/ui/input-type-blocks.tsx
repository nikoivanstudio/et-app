'use client';

import { CircleX, Plus } from 'lucide-react';

import { InputProps } from '@/entities/form-dialog/domain';
import {
  emptyTourContent,
  InfoItem,
  RouteStop,
  Ticket,
  TourContent
} from '@/entities/tour/model/content';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

const Section = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className='flex flex-col gap-3 border rounded-md p-3'>
    <span className='font-semibold text-sm'>{title}</span>
    {children}
  </div>
);

const removeAt = <T,>(arr: T[], index: number): T[] => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1)
];

const StringList = ({
  items,
  onItems,
  placeholder,
  multiline
}: {
  items: string[];
  onItems: (next: string[]) => void;
  placeholder: string;
  multiline?: boolean;
}) => (
  <div className='flex flex-col gap-2'>
    {items.map((item, idx) => (
      <div key={idx} className='flex items-start gap-2'>
        {multiline ? (
          <Textarea
            value={item}
            placeholder={placeholder}
            onChange={e =>
              onItems(items.map((v, i) => (i === idx ? e.target.value : v)))
            }
          />
        ) : (
          <Input
            value={item}
            placeholder={placeholder}
            onChange={e =>
              onItems(items.map((v, i) => (i === idx ? e.target.value : v)))
            }
          />
        )}
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={() => onItems(removeAt(items, idx))}
        >
          <CircleX />
        </Button>
      </div>
    ))}
    <Button
      type='button'
      variant='outline'
      size='sm'
      className='self-start'
      onClick={() => onItems([...items, ''])}
    >
      <Plus /> Добавить
    </Button>
  </div>
);

export const InputTypeBlocks = <
  T extends Record<string, unknown> = Record<string, string>
>({
  name,
  onChange,
  type,
  value
}: InputProps<T, TourContent>) => {
  if (type !== 'blocks') return null;

  const content: TourContent = value ?? emptyTourContent;
  const emit = (next: Partial<TourContent>) =>
    onChange({ [name]: { ...content, ...next } });

  const updateStop = (idx: number, patch: Partial<RouteStop>) =>
    emit({
      routeStops: content.routeStops.map((s, i) =>
        i === idx ? { ...s, ...patch } : s
      )
    });

  const updateTicket = (idx: number, patch: Partial<Ticket>) =>
    emit({
      tickets: content.tickets.map((t, i) =>
        i === idx ? { ...t, ...patch } : t
      )
    });

  const updateInfo = (idx: number, patch: Partial<InfoItem>) =>
    emit({
      info: content.info.map((it, i) => (i === idx ? { ...it, ...patch } : it))
    });

  return (
    <div className='flex flex-col gap-4'>
      <Section title='О туре'>
        <Textarea
          value={content.lead}
          placeholder='Краткое описание тура (lead)'
          onChange={e => emit({ lead: e.target.value })}
        />
        <span className='text-xs text-zinc-500'>Теги-фишки</span>
        <StringList
          items={content.tags}
          placeholder='🏔 Горное озеро'
          onItems={tags => emit({ tags })}
        />
      </Section>

      <Section title='Маршрут'>
        {content.routeStops.map((stop, idx) => (
          <div key={idx} className='flex flex-col gap-2 border rounded-md p-2'>
            <div className='flex items-center justify-between'>
              <span className='text-xs text-zinc-500'>Остановка {idx + 1}</span>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() =>
                  emit({ routeStops: removeAt(content.routeStops, idx) })
                }
              >
                <CircleX />
              </Button>
            </div>
            <Input
              value={stop.title}
              placeholder='Название (напр. Эски-Кермен)'
              onChange={e => updateStop(idx, { title: e.target.value })}
            />
            <Input
              value={stop.titleHref ?? ''}
              placeholder='Ссылка на название (необязательно)'
              onChange={e => updateStop(idx, { titleHref: e.target.value })}
            />
            <Textarea
              value={stop.sub ?? ''}
              placeholder='Описание остановки'
              onChange={e => updateStop(idx, { sub: e.target.value })}
            />
            <Input
              value={stop.wikiHref ?? ''}
              placeholder='Ссылка (wiki), необязательно'
              onChange={e => updateStop(idx, { wikiHref: e.target.value })}
            />
            <Input
              value={stop.coordinates ?? ''}
              placeholder='Координаты (необязательно)'
              onChange={e => updateStop(idx, { coordinates: e.target.value })}
            />
          </div>
        ))}
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='self-start'
          onClick={() =>
            emit({
              routeStops: [...content.routeStops, { title: '' }]
            })
          }
        >
          <Plus /> Добавить остановку
        </Button>
      </Section>

      <Section title='Стоимость'>
        <Input
          value={content.priceLabel ?? ''}
          placeholder='ЦЕНА ЗА МАШИНУ'
          onChange={e => emit({ priceLabel: e.target.value })}
        />
        <Input
          value={content.priceValue ?? ''}
          placeholder='9 500 ₽'
          onChange={e => emit({ priceValue: e.target.value })}
        />
        <Input
          value={content.priceNote ?? ''}
          placeholder='без учёта скидки'
          onChange={e => emit({ priceNote: e.target.value })}
        />
        <Input
          value={content.vkUrl ?? ''}
          placeholder='Ссылка на ВКонтакте (необязательно)'
          onChange={e => emit({ vkUrl: e.target.value })}
        />
      </Section>

      <Section title='Билеты'>
        {content.tickets.map((ticket, idx) => (
          <div key={idx} className='flex flex-col gap-2 border rounded-md p-2'>
            <div className='flex items-center justify-between'>
              <span className='text-xs text-zinc-500'>Билет {idx + 1}</span>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => emit({ tickets: removeAt(content.tickets, idx) })}
              >
                <CircleX />
              </Button>
            </div>
            <Input
              value={ticket.label}
              placeholder='Взрослый'
              onChange={e => updateTicket(idx, { label: e.target.value })}
            />
            <Input
              value={ticket.hint ?? ''}
              placeholder='Подсказка (напр. с удостоверением)'
              onChange={e => updateTicket(idx, { hint: e.target.value })}
            />
            <Input
              value={ticket.price ?? ''}
              placeholder='300 ₽'
              onChange={e => updateTicket(idx, { price: e.target.value })}
            />
            <label className='flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={!!ticket.free}
                onChange={e => updateTicket(idx, { free: e.target.checked })}
              />
              Бесплатно
            </label>
          </div>
        ))}
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='self-start'
          onClick={() =>
            emit({ tickets: [...content.tickets, { label: '' }] })
          }
        >
          <Plus /> Добавить билет
        </Button>
        <span className='text-xs text-zinc-500'>Примечание к билетам</span>
        <Textarea
          value={content.ticketsNote ?? ''}
          placeholder='С 1 марта 2023 года вход — платный…'
          onChange={e => emit({ ticketsNote: e.target.value })}
        />
      </Section>

      <Section title='Полезно знать'>
        {content.info.map((item, idx) => (
          <div key={idx} className='flex items-start gap-2'>
            <Input
              value={item.label}
              placeholder='Старт'
              onChange={e => updateInfo(idx, { label: e.target.value })}
            />
            <Input
              value={item.value}
              placeholder='Бахчисарай или по согласованию'
              onChange={e => updateInfo(idx, { value: e.target.value })}
            />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => emit({ info: removeAt(content.info, idx) })}
            >
              <CircleX />
            </Button>
          </div>
        ))}
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='self-start'
          onClick={() =>
            emit({ info: [...content.info, { label: '', value: '' }] })
          }
        >
          <Plus /> Добавить пункт
        </Button>
      </Section>

      <Section title='Что вас ждёт'>
        <span className='text-xs text-zinc-500'>Абзацы</span>
        <StringList
          items={content.awaitsParagraphs}
          placeholder='Описание впечатлений…'
          multiline
          onItems={awaitsParagraphs => emit({ awaitsParagraphs })}
        />
        <span className='text-xs text-zinc-500'>Заголовок списка</span>
        <Input
          value={content.awaitsHighlightsTitle ?? ''}
          placeholder='Коротко о впечатлениях'
          onChange={e => emit({ awaitsHighlightsTitle: e.target.value })}
        />
        <span className='text-xs text-zinc-500'>Пункты впечатлений</span>
        <StringList
          items={content.awaitsHighlights}
          placeholder='Виды на горы и каньон…'
          onItems={awaitsHighlights => emit({ awaitsHighlights })}
        />
      </Section>
    </div>
  );
};
