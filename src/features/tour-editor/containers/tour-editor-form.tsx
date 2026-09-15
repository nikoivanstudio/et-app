'use client';

import { AlertTriangle, Check, Eye, Power, Send } from 'lucide-react';
import Link from 'next/link';
import { FC, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { tourChip } from '@/features/cabinet/lib/format';

import { TourStatus } from '@/entities/tour/domain';

import { cn } from '@/shared/lib/css';
import { cabinetAction, CabinetNote, Chip } from '@/shared/ui/cabinet';

import { routes } from '@/kernel/routes';

import {
  useSaveTour,
  useTourPhotos,
  useTourStatus
} from '../hooks/use-tour-editor';
import { buildTourChecklist, missingRequired } from '../lib/checklist';
import { saveTourSchema } from '../model/schemas';
import { EditorPhoto, TourEditorData } from '../model/types';
import { EditorAside } from '../ui/editor-aside';
import { BasicsStep } from '../ui/steps/basics-step';
import { CalendarStep } from '../ui/steps/calendar-step';
import { DescriptionStep } from '../ui/steps/description-step';
import { MeetingStep } from '../ui/steps/meeting-step';
import { PhotosStep } from '../ui/steps/photos-step';
import { PricingStep } from '../ui/steps/pricing-step';

const STEPS = [
  { id: 'basics', label: 'Основное' },
  { id: 'description', label: 'Описание' },
  { id: 'pricing', label: 'Цены' },
  { id: 'calendar', label: 'Календарь' },
  { id: 'photos', label: 'Фото' },
  { id: 'meeting', label: 'Точка старта' }
] as const;

type StepId = (typeof STEPS)[number]['id'];

const toPayload = (tour: TourEditorData) => ({
  ...(tour.id ? { id: tour.id } : {}),
  title: tour.title,
  about: tour.about,
  description: tour.description,
  startCity: tour.startCity,
  durationHours: tour.durationHours,
  capacity: tour.capacity,
  difficulty: tour.difficulty || null,
  price: tour.price,
  priceUnit: tour.priceUnit,
  seasons: tour.seasons,
  categories: tour.categories,
  included: tour.included,
  excluded: tour.excluded,
  faq: tour.faq,
  routeStops: tour.routeStops,
  priceOptions: tour.priceOptions,
  minGroupSize: tour.minGroupSize,
  bookingLeadDays: tour.bookingLeadDays,
  startTime: tour.startTime,
  weekdays: tour.weekdays,
  blockedDates: tour.blockedDates,
  meetingAddress: tour.meetingAddress,
  meetingNote: tour.meetingNote,
  pickupCities: tour.pickupCities,
  metaTitle: tour.metaTitle,
  metaDescription: tour.metaDescription
});

/**
 * Редактор тура: шесть шагов, черновик и отправка на проверку.
 *
 * Форма держит состояние целиком у себя и сохраняется явно — «сохранить» на
 * каждом шаге. Автосохранения по вводу нет намеренно: правка опубликованного
 * тура возвращает его на модерацию, и делать это на каждую букву нельзя.
 */
export const TourEditorForm: FC<{
  userId: number;
  /** Тур приходит с сервера — отрисованным, а не загружаемым на клиенте. */
  initial: TourEditorData;
}> = ({ userId, initial }) => {
  const { save, isSaving } = useSaveTour(userId);
  const { setStatus, isPending: isStatusPending } = useTourStatus();

  const [draft, setDraft] = useState<TourEditorData>(initial);
  const [step, setStep] = useState<StepId>('basics');
  const [isDirty, setDirty] = useState(false);

  const set = <K extends keyof TourEditorData>(
    key: K,
    value: TourEditorData[K]
  ) => {
    setDraft(current => ({ ...current, [key]: value }));
    setDirty(true);
  };

  // Фотографии живут на сервере: мутации возвращают результат, и форма
  // подставляет его в черновик, не перезапрашивая весь тур.
  const photos = useTourPhotos(draft.id, {
    onAdded: (added: EditorPhoto[]) =>
      setDraft(current => ({ ...current, photos: [...current.photos, ...added] })),
    onMainSet: (photoId: number) =>
      setDraft(current => ({
        ...current,
        photos: current.photos.map(photo => ({
          ...photo,
          isMain: photo.id === photoId
        }))
      })),
    onRemoved: (photoId: number) =>
      setDraft(current => {
        const rest = current.photos.filter(photo => photo.id !== photoId);

        return {
          ...current,
          photos: rest.some(photo => photo.isMain)
            ? rest
            : rest.map((photo, index) => ({ ...photo, isMain: index === 0 }))
        };
      })
  });

  const checklist = useMemo(() => buildTourChecklist(draft), [draft]);
  const missing = missingRequired(checklist);

  const submit = async (): Promise<boolean> => {
    const parsed = saveTourSchema.safeParse(toPayload(draft));

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Проверьте поля тура');

      return false;
    }

    await save(parsed.data);
    setDirty(false);

    return true;
  };

  const goToStep = async (next: StepId) => {
    // Переход между шагами сохраняет черновик: иначе загрузка фотографий
    // на пятом шаге потеряла бы всё, что набрано на первых четырёх.
    if (isDirty && draft.title.length >= 10) await submit();

    setStep(next);
  };

  const publish = async () => {
    if (isDirty && !(await submit())) return;
    if (!draft.id) return;

    setStatus({ id: draft.id, status: TourStatus.PENDING });
  };

  const chip = tourChip(draft.status);
  const currentIndex = STEPS.findIndex(item => item.id === step);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center gap-2'>
        {STEPS.map((item, index) => {
          const isCurrent = item.id === step;
          const isPassed = index < currentIndex;

          return (
            <button
              key={item.id}
              type='button'
              onClick={() => goToStep(item.id)}
              className={cn(
                'flex items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-2 text-[12.5px]',
                isCurrent
                  ? 'border-cab-gold/50 bg-cab-gold/12 text-cab-ink'
                  : 'border-cab-line bg-cab-raise text-cab-dim'
              )}
            >
              <span
                className={cn(
                  'grid size-[21px] place-items-center rounded-full text-[11.5px] font-semibold',
                  isCurrent
                    ? 'bg-cab-gold text-cab-on-gold'
                    : isPassed
                      ? 'bg-cab-ok/18 text-cab-ok'
                      : 'bg-cab-line text-cab-dim'
                )}
              >
                {isPassed ? <Check className='size-3' /> : index + 1}
              </span>
              {item.label}
            </button>
          );
        })}

        <span className='ml-auto flex items-center gap-2'>
          <Chip tone={chip.tone}>{chip.label}</Chip>
          {isDirty && (
            <span className='text-cab-gold text-[12px]'>есть несохранённое</span>
          )}
        </span>
      </div>

      <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_372px] xl:items-start'>
        <div className='flex flex-col gap-4'>
          {step === 'basics' && <BasicsStep tour={draft} set={set} />}
          {step === 'description' && <DescriptionStep tour={draft} set={set} />}
          {step === 'pricing' && <PricingStep tour={draft} set={set} />}
          {step === 'calendar' && <CalendarStep tour={draft} set={set} />}
          {step === 'photos' && (
            <PhotosStep
              tour={draft}
              isUploading={photos.isUploading}
              onUpload={photos.upload}
              onSetMain={photos.setMain}
              onRemove={photos.remove}
            />
          )}
          {step === 'meeting' && <MeetingStep tour={draft} set={set} />}

          <div className='border-cab-gold/34 from-cab-gold/10 to-cab-panel flex flex-col gap-4 rounded-2xl border bg-linear-120 p-4 sm:p-5 lg:flex-row lg:items-center'>
            <div className='min-w-0'>
              <h3 className='text-[15.5px] font-semibold'>
                {missing.length
                  ? 'Осталось заполнить обязательное'
                  : 'Всё заполнено — можно отправлять'}
              </h3>
              <p className='text-cab-faint mt-1.5 text-[12.5px] leading-relaxed'>
                {missing.length ? (
                  <>
                    <AlertTriangle className='mr-1 inline size-3.5' />
                    {missing.map(item => item.label).join(', ')}.
                  </>
                ) : (
                  'Администратор проверит тур примерно за сутки. Пока идёт проверка, тур виден только вам, а править его можно — правки уйдут на ту же проверку.'
                )}
              </p>
            </div>

            <div className='flex shrink-0 flex-wrap gap-2 lg:ml-auto'>
              <button
                type='button'
                disabled={isSaving}
                onClick={submit}
                className={cabinetAction({ tone: 'solid' })}
              >
                {isSaving ? 'Сохраняем…' : 'Сохранить черновик'}
              </button>

              {draft.status === TourStatus.APPROVED ? (
                <button
                  type='button'
                  disabled={isStatusPending || !draft.id}
                  onClick={() =>
                    draft.id && setStatus({ id: draft.id, status: 'DRAFT' })
                  }
                  className={cabinetAction({ tone: 'line' })}
                >
                  <Power className='size-4' />
                  Снять с публикации
                </button>
              ) : (
                <button
                  type='button'
                  disabled={isStatusPending || !!missing.length}
                  onClick={publish}
                  title={
                    missing.length
                      ? 'Сначала заполните обязательные поля'
                      : undefined
                  }
                  className={cabinetAction({ tone: 'gold' })}
                >
                  <Send className='size-4' />
                  Отправить на проверку
                </button>
              )}

              {draft.status === TourStatus.APPROVED && (
                <Link
                  href={routes.tour(draft.slug)}
                  className={cabinetAction({ tone: 'line' })}
                >
                  <Eye className='size-4' />
                  На сайте
                </Link>
              )}
            </div>
          </div>

          {!!draft.rejectionComment && (
            <CabinetNote tone='bad'>
              <AlertTriangle className='mt-0.5 size-3.5 shrink-0' />
              <span>Причина отклонения: {draft.rejectionComment}</span>
            </CabinetNote>
          )}
        </div>

        <EditorAside tour={draft} />
      </div>
    </div>
  );
};
