'use client';

import { Minus, Plus } from 'lucide-react';
import { FC, useState } from 'react';

import { cn } from '@/shared/lib/css';

import {
  CreateBookingResult,
  useCreateBooking
} from '../hooks/use-create-booking';

type Props = {
  tourId: number;
  priceLabel?: string;
  onSuccess: (result: CreateBookingResult) => void;
};

const labelCls =
  'mb-1.5 block font-oswald text-xs uppercase tracking-wide text-ink-muted';
const inputCls =
  'w-full min-h-12 rounded-control border border-rule bg-[#fffdf8] px-3.5 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-[1.5px] focus:border-cta';

export const BookingForm: FC<Props> = ({ tourId, priceLabel, onSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [desiredDate, setDesiredDate] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);
  const [comment, setComment] = useState('');
  const [agreement, setAgreement] = useState(true);
  const [company, setCompany] = useState(''); // honeypot
  const [localError, setLocalError] = useState('');

  const { createBooking, isPending, error } = useCreateBooking({ onSuccess });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (name.trim().length < 2) {
      setLocalError('Укажите имя');

      return;
    }
    if (!phone.trim()) {
      setLocalError('Укажите телефон');

      return;
    }
    if (!agreement) {
      setLocalError('Необходимо подтвердить согласие');

      return;
    }

    createBooking({
      tourId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      desiredDate: desiredDate || undefined,
      peopleCount,
      comment: comment.trim() || undefined,
      agreement: true,
      company: company || undefined
    });
  };

  const message = localError || error?.message;

  return (
    <form onSubmit={onSubmit} className='font-caladea'>
      <p className='text-[12.5px] text-ink-muted'>
        Гид свяжется с вами и подтвердит детали. Предоплата не требуется.
      </p>

      <div className='mt-4'>
        <label className={labelCls} htmlFor='bk-name'>
          Ваше имя <span className='text-alert-ink'>*</span>
        </label>
        <input
          id='bk-name'
          className={inputCls}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder='Как к вам обращаться'
          autoComplete='name'
        />
      </div>

      <div className='mt-3'>
        <label className={labelCls} htmlFor='bk-phone'>
          Телефон <span className='text-alert-ink'>*</span>
        </label>
        <input
          id='bk-phone'
          className={inputCls}
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder='+7 ___ ___-__-__'
          inputMode='tel'
          autoComplete='tel'
        />
      </div>

      <div className='mt-3 grid grid-cols-2 gap-2.5'>
        <div>
          <label className={labelCls} htmlFor='bk-date'>
            Желаемая дата
          </label>
          <input
            id='bk-date'
            type='date'
            className={inputCls}
            value={desiredDate}
            onChange={e => setDesiredDate(e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Гостей</label>
          <div className='flex min-h-12 items-center justify-between rounded-control border border-rule bg-[#fffdf8] px-1.5'>
            <button
              type='button'
              aria-label='Меньше гостей'
              onClick={() => setPeopleCount(v => Math.max(1, v - 1))}
              className='grid h-11 w-11 place-items-center rounded-control border border-rule bg-white text-gold-head'
            >
              <Minus className='size-4' />
            </button>
            <b className='font-oswald text-base text-ink'>
              {peopleCount}
            </b>
            <button
              type='button'
              aria-label='Больше гостей'
              onClick={() => setPeopleCount(v => Math.min(100, v + 1))}
              className='grid h-11 w-11 place-items-center rounded-control border border-rule bg-white text-gold-head'
            >
              <Plus className='size-4' />
            </button>
          </div>
        </div>
      </div>

      <div className='mt-3'>
        <label className={labelCls} htmlFor='bk-email'>
          Email <span className='text-ink-faint'>(для входа и истории)</span>
        </label>
        <input
          id='bk-email'
          type='email'
          className={inputCls}
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='по желанию'
          autoComplete='email'
        />
      </div>

      <div className='mt-3'>
        <label className={labelCls} htmlFor='bk-comment'>
          Комментарий
        </label>
        <textarea
          id='bk-comment'
          className={cn(inputCls, 'min-h-[64px] resize-none')}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder='пожелания, дети, трансфер…'
        />
      </div>

      {/* honeypot — скрыто от людей */}
      <input
        type='text'
        tabIndex={-1}
        autoComplete='off'
        aria-hidden='true'
        className='absolute left-[-9999px] h-0 w-0 opacity-0'
        value={company}
        onChange={e => setCompany(e.target.value)}
      />

      <label className='mt-3.5 flex items-start gap-2.5 text-[12px] leading-snug text-ink-muted'>
        <input
          type='checkbox'
          checked={agreement}
          onChange={e => setAgreement(e.target.checked)}
          className='mt-0.5 size-4 accent-cta'
        />
        <span>Согласен на обработку данных и условия платформы</span>
      </label>

      {!!message && (
        <p className='mt-3 rounded-control bg-alert-bg px-3 py-2 text-[13px] text-alert-ink'>
          {message}
        </p>
      )}

      <button
        type='submit'
        disabled={isPending}
        className='mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-pill bg-cta px-4 font-oswald text-base font-medium tracking-wide text-on-cta hover:bg-cta-press disabled:opacity-60'
      >
        {isPending ? 'Отправляем…' : 'Отправить заявку'}
        {!!priceLabel && !isPending && (
          <span className='opacity-70'>· {priceLabel}</span>
        )}
      </button>
    </form>
  );
};
