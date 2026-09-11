import Link from 'next/link';
import { FC } from 'react';

import { CONTACTS } from '@/widgets/contacts/constants/contacts';

import { BaseApplicationForm } from '@/features/application-form';

import { cn } from '@/shared/lib/css';
import { formatNumber } from '@/shared/lib/string-utils';
import { TelegramGlyph, WhatsAppGlyph } from '@/shared/ui/social-glyphs';

type Props = {
  /** Название страницы — уходит в письмо, чтобы был виден источник заявки. */
  entityName: string;
  entityId?: string;
  entityType?: 'tour' | 'activity' | 'page';
  /** Подпись под кнопками. */
  note?: string;
  className?: string;
};

const messengerClassName =
  'border-rule text-ink hover:bg-cream-deep rounded-pill font-oswald inline-flex min-h-12 flex-1 items-center justify-center gap-2 border bg-transparent text-[14.5px] tracking-wide transition-colors';

/**
 * Блок заявки: форма, телефон и мессенджеры (задача A7).
 *
 * До него оставить заявку можно было ровно с одной страницы сайта —
 * `/tour/[slug]`, где стоит `BookingButton`. На остальных, включая все
 * легаси-страницы туров, которые как раз и находятся в индексе, не было
 * ни формы, ни телефона: единственный контакт жил в подвале.
 * Форма `BaseApplicationForm` при этом была написана и не использовалась
 * нигде.
 *
 * Мессенджеры рядом с телефоном — не украшение: в нише это основной канал.
 * Обычные ссылки, без модалок и виджетов: модалка, которая не открылась,
 * стоит заявки, а `tel:`, `https://t.me/` и `https://wa.me/` работают
 * всегда и на любом устройстве.
 */
export const LeadActions: FC<Props> = ({
  entityName,
  entityId = '',
  entityType = 'page',
  note = 'Расскажем про маршрут, подберём дату и ответим на вопросы',
  className
}) => {
  const phone = CONTACTS.phones[0];

  return (
    <section className={cn('flex flex-col gap-2.5', className)}>
      <BaseApplicationForm appData={{ entityName, entityId, entityType }} />

      <Link
        className='bg-cta text-on-cta hover:bg-cta-press rounded-pill font-oswald inline-flex min-h-12 w-full items-center justify-center text-[15px] tracking-wide transition-colors'
        href={`tel:${phone}`}
      >
        Позвонить {formatNumber(phone)}
      </Link>

      <div className='flex gap-2.5'>
        <Link
          className={messengerClassName}
          href={CONTACTS.telegram}
          rel='noopener'
          target='_blank'
        >
          <TelegramGlyph />
          Telegram
        </Link>
        <Link
          className={messengerClassName}
          href={CONTACTS.whatsapp}
          rel='noopener'
          target='_blank'
        >
          <WhatsAppGlyph />
          WhatsApp
        </Link>
      </div>

      {!!note && (
        <p className='font-oswald text-ink-faint mt-0.5 text-center text-[12.5px]'>
          {note}
        </p>
      )}
    </section>
  );
};
