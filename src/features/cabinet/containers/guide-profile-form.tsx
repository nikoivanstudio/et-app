'use client';

import { Check, Eye, ImagePlus, LogOut, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useRef, useState } from 'react';
import { toast } from 'sonner';

import { ChipsInput } from '@/features/tour-editor/ui/chips-input';

import type { CityOption } from '@/entities/city/domain';
import { CitySelect } from '@/entities/city/ui/city-select';

import { apiClient } from '@/shared/api/api-client';
import { cn } from '@/shared/lib/css';
import {
  cabinetAction,
  cabinetInput,
  CabinetNote,
  CabinetPanel,
  Chip,
  Field
} from '@/shared/ui/cabinet';

import { routes } from '@/kernel/routes';

import { formatDateTime } from '../lib/format';
import { guideProfileSchema } from '../model/profile-schemas';
import { CabinetSession, GuideProfileData } from '../services/profile-service';

/**
 * Тумблеры писем.
 *
 * `soon` — рассылки, которой пока нет: настройка сохраняется, но обещать
 * письмо, которое никто не отправляет, нельзя, поэтому так и подписано.
 */
const NOTIFICATIONS: {
  id:
    | 'notifyNewBooking'
    | 'notifyNewMessage'
    | 'notifyTripReminder'
    | 'notifyNews';
  label: string;
  hint: string;
  soon?: boolean;
}[] = [
  {
    id: 'notifyNewBooking',
    label: 'Письмо о новой заявке',
    hint: 'Приходит сразу, как клиент нажал «Оставить заявку»'
  },
  {
    id: 'notifyNewMessage',
    label: 'Письмо о новом сообщении',
    hint: 'Не чаще раза в час, чтобы переписка не забивала почту'
  },
  {
    id: 'notifyTripReminder',
    label: 'Напоминание о завтрашнем выезде',
    hint: 'Вечером накануне, со списком гостей и телефоном',
    soon: true
  },
  {
    id: 'notifyNews',
    label: 'Новости площадки',
    hint: 'Изменения правил, новые разделы каталога',
    soon: true
  }
];

const Toggle: FC<{
  label: string;
  hint: string;
  checked: boolean;
  soon?: boolean;
  onChange: (value: boolean) => void;
}> = ({ label, hint, checked, soon, onChange }) => (
  <button
    type='button'
    role='switch'
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className='border-cab-line bg-cab-raise flex items-center justify-between gap-4 rounded-xl border px-3.5 py-3 text-left'
  >
    <span>
      <span className='block text-[13px] font-medium'>
        {label}
        {soon && <Chip className='ml-2 align-middle'>пока не рассылается</Chip>}
      </span>
      <span className='text-cab-mute mt-0.5 block text-[11.5px]'>{hint}</span>
    </span>
    <span
      className={cn(
        'relative h-6 w-10 shrink-0 rounded-full transition-colors',
        checked ? 'bg-cab-gold/35' : 'bg-cab-line'
      )}
    >
      <span
        className={cn(
          'absolute top-[3px] size-[18px] rounded-full transition-all',
          checked ? 'left-5 bg-cab-gold' : 'left-[3px] bg-cab-mute'
        )}
      />
    </span>
  </button>
);

/**
 * Профиль гида.
 *
 * Всё, что клиент видит до заявки, и всё, чем гид управляет после: контакты,
 * письма и устройства. Телефон здесь только показывается — меняется он через
 * подтверждение кодом, а не правкой поля.
 */
export const GuideProfileForm: FC<{
  profile: GuideProfileData;
  sessions: CabinetSession[];
  /** Справочник городов: гид выбирает из него, а не набирает руками. */
  cities: CityOption[];
}> = ({ profile, sessions, cities }) => {
  const router = useRouter();
  const [form, setForm] = useState(profile);
  // В форме лежит слаг, а в карточке показывается название.
  const cityTitle = cities.find(city => city.slug === form.citySlug)?.title;
  const [isSaving, setSaving] = useState(false);
  const avatarInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof GuideProfileData>(
    key: K,
    value: GuideProfileData[K]
  ) => setForm(current => ({ ...current, [key]: value }));

  const save = async () => {
    const parsed = guideProfileSchema.safeParse(form);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Проверьте поля профиля');

      return;
    }

    setSaving(true);

    try {
      await apiClient.patch({
        url: 'cabinet/profile',
        body: JSON.stringify(parsed.data),
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success('Профиль сохранён');
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async (
    event: ChangeEvent<HTMLInputElement>,
    kind: 'avatar' | 'cover'
  ) => {
    const file = event.target.files?.[0];

    event.target.value = '';

    if (!file) return;

    const formData = new FormData();

    formData.append('file', file);
    formData.append('kind', kind);

    try {
      const result = await apiClient.post<{ source: string }>({
        url: 'cabinet/profile/photo',
        body: formData
      });

      set(kind === 'avatar' ? 'avatar' : 'cover', result.source);
      toast.success('Фотография обновлена');
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const endSession = async (id?: string) => {
    try {
      await apiClient.del({
        url: 'cabinet/sessions',
        ...(id ? { queryParams: { id } } : {})
      });

      if (id) {
        toast.success('Устройство отключено');
        router.refresh();
      } else {
        // Текущая сессия тоже отозвана — дальше только вход заново.
        window.location.assign(routes.signIn());
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_372px] xl:items-start'>
      <div className='flex flex-col gap-4'>
        <CabinetPanel title='Кто вы'>
          <div className='flex flex-wrap items-start gap-4'>
            <span className='border-cab-line bg-cab-raise relative size-24 overflow-hidden rounded-2xl border'>
              {form.avatar ? (
                <Image
                  src={form.avatar}
                  alt='Фото гида'
                  fill
                  sizes='96px'
                  className='object-cover'
                />
              ) : (
                <span className='text-cab-mute flex h-full items-center justify-center text-[11.5px]'>
                  нет фото
                </span>
              )}
            </span>

            <div className='flex flex-col items-start gap-2'>
              <button
                type='button'
                onClick={() => avatarInput.current?.click()}
                className={cabinetAction({ tone: 'solid', size: 'sm' })}
              >
                <ImagePlus className='size-4' />
                Заменить фото
              </button>
              <button
                type='button'
                onClick={() => coverInput.current?.click()}
                className={cabinetAction({ tone: 'line', size: 'sm' })}
              >
                <ImagePlus className='size-4' />
                Обложка страницы
              </button>
              <p className='text-cab-mute max-w-[42ch] text-[11.5px] leading-relaxed'>
                Квадратное фото от 400 px. Карточки с настоящим фото собирают
                заметно больше заявок, чем с логотипом.
              </p>
              <input
                ref={avatarInput}
                type='file'
                accept='image/*'
                onChange={event => uploadPhoto(event, 'avatar')}
                className='hidden'
              />
              <input
                ref={coverInput}
                type='file'
                accept='image/*'
                onChange={event => uploadPhoto(event, 'cover')}
                className='hidden'
              />
            </div>
          </div>

          <div className='mt-4 grid gap-4 sm:grid-cols-2'>
            <Field label='Имя' htmlFor='profile-first-name'>
              <input
                id='profile-first-name'
                value={form.firstName}
                onChange={event => set('firstName', event.target.value)}
                maxLength={60}
                className={cabinetInput}
              />
            </Field>
            <Field label='Фамилия' htmlFor='profile-last-name'>
              <input
                id='profile-last-name'
                value={form.lastName}
                onChange={event => set('lastName', event.target.value)}
                maxLength={60}
                className={cabinetInput}
              />
            </Field>
          </div>

          <Field
            className='mt-4'
            label='Одной строкой'
            htmlFor='profile-headline'
            hint={`${form.headline.length} из 160 знаков. Строка показывается под именем в каталоге гидов.`}
          >
            <input
              id='profile-headline'
              value={form.headline}
              onChange={event => set('headline', event.target.value)}
              maxLength={160}
              placeholder='Джип-туры по Крыму с 2014 года'
              className={cabinetInput}
            />
          </Field>

          <Field
            className='mt-4'
            label='О себе'
            htmlFor='profile-bio'
            hint={`${form.bio.length} из 2000 знаков.`}
          >
            <textarea
              id='profile-bio'
              value={form.bio}
              onChange={event => set('bio', event.target.value)}
              rows={6}
              maxLength={2000}
              className={cn(cabinetInput, 'resize-y leading-relaxed')}
            />
          </Field>

          <div className='mt-4 grid gap-4 sm:grid-cols-3'>
            <Field label='Город' htmlFor='profile-city'>
              <CitySelect
                id='profile-city'
                value={form.citySlug}
                cities={cities}
                onChange={slug => set('citySlug', slug)}
              />
            </Field>
            <Field label='Вожу с' htmlFor='profile-since'>
              <input
                id='profile-since'
                type='number'
                min={1970}
                max={new Date().getFullYear()}
                value={form.experienceSince ?? ''}
                onChange={event =>
                  set(
                    'experienceSince',
                    event.target.value ? Number(event.target.value) : null
                  )
                }
                className={cabinetInput}
              />
            </Field>
            <Field label='Адрес страницы'>
              <span className='border-cab-line text-cab-info flex min-h-11 items-center rounded-[10px] border bg-[#121215] px-3 text-[13px]'>
                /guide/{form.slug}
              </span>
            </Field>
          </div>

          <div className='mt-4 grid gap-4 sm:grid-cols-2'>
            <Field label='На чём специализируюсь'>
              <ChipsInput
                values={form.specializations}
                onChange={values => set('specializations', values)}
                placeholder='Джиппинг'
                maxLength={60}
              />
            </Field>
            <Field label='Языки'>
              <ChipsInput
                values={form.languages}
                onChange={values => set('languages', values)}
                placeholder='Русский'
                maxLength={60}
              />
            </Field>
          </div>

          <Field
            className='mt-4'
            label='Машина'
            htmlFor='profile-vehicle'
            hint='Вместимость задаётся у тура, здесь — описание техники для карточки гида.'
          >
            <input
              id='profile-vehicle'
              value={form.vehicle}
              onChange={event => set('vehicle', event.target.value)}
              maxLength={200}
              placeholder='Mitsubishi Pajero, 6 мест, детское кресло'
              className={cabinetInput}
            />
          </Field>
        </CabinetPanel>

        <CabinetPanel title='Контакты и уведомления'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <Field label='Телефон' hint='Меняется через подтверждение кодом.'>
              <span className='border-cab-line flex min-h-11 items-center gap-2 rounded-[10px] border bg-[#121215] px-3 text-[13px]'>
                {form.phone || '—'}
                <Chip tone='ok' className='ml-auto'>
                  <ShieldCheck className='size-3.5' />
                  вход по коду
                </Chip>
              </span>
            </Field>
            <Field label='Почта' htmlFor='profile-email'>
              <input
                id='profile-email'
                type='email'
                value={form.email}
                onChange={event => set('email', event.target.value)}
                className={cabinetInput}
              />
            </Field>
          </div>

          <div className='mt-4 flex flex-col gap-2'>
            {NOTIFICATIONS.map(item => (
              <Toggle
                key={item.id}
                label={item.label}
                hint={item.hint}
                soon={item.soon}
                checked={form[item.id]}
                onChange={value => set(item.id, value)}
              />
            ))}
          </div>

          <CabinetNote className='mt-4'>
            Телефон клиента приходит в самой заявке — в переписке обмен номерами
            заблокирован с обеих сторон.
          </CabinetNote>
        </CabinetPanel>

        <CabinetPanel title='Вход и устройства'>
          <ul className='flex flex-col'>
            {sessions.map(session => (
              <li
                key={session.id}
                className='border-cab-line-soft flex items-center gap-3 border-b py-3 first:pt-0 last:border-b-0 last:pb-0'
              >
                <span className='min-w-0'>
                  <span className='block text-[13px] font-medium'>
                    {session.isCurrent ? 'Это устройство' : 'Другое устройство'}
                  </span>
                  <span className='text-cab-mute mt-0.5 block text-[11.5px]'>
                    вход {formatDateTime(session.createdAt)} · действует до{' '}
                    {formatDateTime(session.expiresAt)}
                  </span>
                </span>
                {session.isCurrent ? (
                  <Chip tone='ok' className='ml-auto'>
                    активна
                  </Chip>
                ) : (
                  <button
                    type='button'
                    onClick={() => endSession(session.id)}
                    className={cn(
                      cabinetAction({ tone: 'line', size: 'sm' }),
                      'ml-auto'
                    )}
                  >
                    Завершить
                  </button>
                )}
              </li>
            ))}
          </ul>

          <div className='mt-4 flex flex-wrap items-center gap-3'>
            <button
              type='button'
              onClick={() => endSession()}
              className={cabinetAction({ tone: 'bad', size: 'sm' })}
            >
              <LogOut className='size-4' />
              Выйти на всех устройствах
            </button>
            <span className='text-cab-mute text-[11.5px]'>
              Заявки и переписка останутся на месте.
            </span>
          </div>
        </CabinetPanel>
      </div>

      <aside className='flex flex-col gap-4'>
        <div className='border-cab-line bg-cab-panel overflow-hidden rounded-2xl border'>
          <span className='bg-cab-raise relative block h-24'>
            {!!form.cover && (
              <Image
                src={form.cover}
                alt='Обложка страницы'
                fill
                sizes='372px'
                className='object-cover'
              />
            )}
          </span>
          <div className='-mt-8 px-4 pb-4'>
            <span className='border-cab-panel bg-cab-raise relative block size-16 overflow-hidden rounded-2xl border-2'>
              {!!form.avatar && (
                <Image
                  src={form.avatar}
                  alt='Фото гида'
                  fill
                  sizes='64px'
                  className='object-cover'
                />
              )}
            </span>
            <h3 className='mt-3 text-[16px] font-semibold'>
              {`${form.firstName} ${form.lastName}`.trim() || 'Имя гида'}
            </h3>
            <p className='text-cab-faint mt-1 text-[12.5px]'>
              {form.headline || 'Пара слов о себе'}
            </p>
            <div className='mt-2.5 flex flex-wrap gap-2'>
              {!!cityTitle && <Chip tone='done'>{cityTitle}</Chip>}
              {!!form.experienceSince && (
                <Chip tone='done'>вожу с {form.experienceSince}</Chip>
              )}
            </div>
            <p className='text-cab-mute mt-3 text-[11.5px] leading-relaxed'>
              Так карточка выглядит в каталоге гидов и в шапке страницы тура.
            </p>
            <Link
              href={routes.guide(form.slug)}
              className={cn(
                cabinetAction({ tone: 'line', size: 'block' }),
                'mt-3'
              )}
            >
              <Eye className='size-4' />
              Открыть публичную страницу
            </Link>
          </div>
        </div>

        <button
          type='button'
          disabled={isSaving}
          onClick={save}
          className={cabinetAction({ tone: 'gold', size: 'block' })}
        >
          <Check className='size-4' />
          {isSaving ? 'Сохраняем…' : 'Сохранить профиль'}
        </button>
      </aside>
    </div>
  );
};
