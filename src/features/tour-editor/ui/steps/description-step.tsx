'use client';

import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';

import { cn } from '@/shared/lib/css';
import { cabinetAction, cabinetInput, Field } from '@/shared/ui/cabinet';

import { TourEditorData } from '../../model/types';
import { ChipsInput } from '../chips-input';

import { StepShell } from './step-shell';

export const DescriptionStep: FC<{
  tour: TourEditorData;
  set: <K extends keyof TourEditorData>(key: K, value: TourEditorData[K]) => void;
}> = ({ tour, set }) => {
  const [stop, setStop] = useState('');
  const [faq, setFaq] = useState({ question: '', answer: '' });

  const addStop = () => {
    const title = stop.trim();

    if (!title) return;

    set('routeStops', [...tour.routeStops, { title }]);
    setStop('');
  };

  const addFaq = () => {
    if (faq.question.trim().length < 3 || faq.answer.trim().length < 3) return;

    set('faq', [...tour.faq, { question: faq.question.trim(), answer: faq.answer.trim() }]);
    setFaq({ question: '', answer: '' });
  };

  return (
    <StepShell
      title='Шаг 2. Описание'
      hint='Основной текст страницы тура и всё, что спрашивают до заявки'
    >
      <Field
        label='Программа тура'
        htmlFor='tour-description'
        hint='Что и в каком порядке происходит на маршруте. Абзацы сохраняются.'
      >
        <textarea
          id='tour-description'
          value={tour.description}
          onChange={event => set('description', event.target.value)}
          rows={9}
          maxLength={20000}
          placeholder='Выезжаем из Ялты в 8:00 от автовокзала. Первая остановка — водопад Учан-Су…'
          className={cn(cabinetInput, 'resize-y leading-relaxed')}
        />
      </Field>

      <Field
        label='Маршрут'
        hint='Точки маршрута показываются списком на странице тура.'
      >
        <div className='flex flex-col gap-2'>
          {tour.routeStops.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className='border-cab-line bg-cab-raise grid grid-cols-[18px_minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] border px-3 py-2.5 text-[13px]'
            >
              <GripVertical className='text-cab-mute size-4' />
              <span>{item.title}</span>
              <button
                type='button'
                aria-label='Убрать точку'
                onClick={() =>
                  set(
                    'routeStops',
                    tour.routeStops.filter(entry => entry !== item)
                  )
                }
                className='text-cab-mute hover:text-cab-bad'
              >
                <Trash2 className='size-4' />
              </button>
            </div>
          ))}

          <div className='flex gap-2'>
            <input
              value={stop}
              onChange={event => setStop(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addStop();
                }
              }}
              placeholder='Водопад Учан-Су'
              aria-label='Новая точка маршрута'
              className={cabinetInput}
            />
            <button
              type='button'
              onClick={addStop}
              className={cabinetAction({ tone: 'solid', size: 'sm' })}
            >
              <Plus className='size-4' />
              Добавить
            </button>
          </div>
        </div>
      </Field>

      <div className='grid gap-4 lg:grid-cols-2'>
        <Field
          label='Что входит в цену'
          hint='Отдельным списком, а не абзацем: он рендерится блоком и попадает в разметку.'
        >
          <ChipsInput
            values={tour.included}
            onChange={values => set('included', values)}
            placeholder='Внедорожник и топливо'
          />
        </Field>
        <Field
          label='Что не входит'
          hint='Входные билеты, обед, страховка. Без этого блока клиент спросит в переписке.'
        >
          <ChipsInput
            values={tour.excluded}
            onChange={values => set('excluded', values)}
            placeholder='Обед'
          />
        </Field>
      </div>

      <Field
        label='Частые вопросы'
        hint='Вопросы уходят в разметку страницы — в поиске они показываются прямо под ссылкой.'
      >
        <div className='flex flex-col gap-2'>
          {tour.faq.map((item, index) => (
            <div
              key={`${item.question}-${index}`}
              className='border-cab-line bg-cab-raise rounded-[10px] border px-3.5 py-3'
            >
              <div className='flex items-start gap-2'>
                <b className='text-[13px] font-semibold'>{item.question}</b>
                <button
                  type='button'
                  aria-label='Убрать вопрос'
                  onClick={() =>
                    set('faq', tour.faq.filter(entry => entry !== item))
                  }
                  className='text-cab-mute hover:text-cab-bad ml-auto'
                >
                  <Trash2 className='size-4' />
                </button>
              </div>
              <p className='text-cab-faint mt-1.5 text-[12.5px] leading-relaxed'>
                {item.answer}
              </p>
            </div>
          ))}

          <div className='flex flex-col gap-2 sm:flex-row'>
            <input
              value={faq.question}
              onChange={event => setFaq({ ...faq, question: event.target.value })}
              placeholder='Дети поедут?'
              aria-label='Вопрос'
              className={cn(cabinetInput, 'sm:max-w-64')}
            />
            <input
              value={faq.answer}
              onChange={event => setFaq({ ...faq, answer: event.target.value })}
              placeholder='Да, маршрут подходит детям с 5 лет.'
              aria-label='Ответ'
              className={cabinetInput}
            />
            <button
              type='button'
              onClick={addFaq}
              className={cabinetAction({ tone: 'solid', size: 'sm' })}
            >
              <Plus className='size-4' />
              Добавить
            </button>
          </div>
        </div>
      </Field>

      <div className='grid gap-4 lg:grid-cols-2'>
        <Field
          label='Заголовок для поиска'
          htmlFor='tour-meta-title'
          hint='Пусто — возьмём название тура.'
        >
          <input
            id='tour-meta-title'
            value={tour.metaTitle}
            onChange={event => set('metaTitle', event.target.value)}
            maxLength={180}
            className={cabinetInput}
          />
        </Field>
        <Field
          label='Описание для поиска'
          htmlFor='tour-meta-description'
          hint='Пусто — возьмём короткое описание тура.'
        >
          <input
            id='tour-meta-description'
            value={tour.metaDescription}
            onChange={event => set('metaDescription', event.target.value)}
            maxLength={400}
            className={cabinetInput}
          />
        </Field>
      </div>

      <p className='text-cab-mute flex items-center gap-2 text-[11.5px]'>
        <Pencil className='size-3.5' />
        Правка опубликованного тура возвращает его на проверку — так изменённый
        текст не уезжает в каталог мимо модератора.
      </p>
    </StepShell>
  );
};
