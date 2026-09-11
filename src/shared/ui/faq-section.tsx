import { FC } from 'react';

import { cn } from '@/shared/lib/css';
import { buildFaqJsonLd, type FaqItem } from '@/shared/lib/seo/json-ld';
import { JsonLd } from '@/shared/ui/json-ld';
import { SectionHeading } from '@/shared/ui/section-heading';

type Props = {
  items: FaqItem[];
  title?: string;
  className?: string;
};

/**
 * Вопросы и ответы: видимый блок и разметка `FAQPage` одним компонентом.
 *
 * Вместе, а не по отдельности, — по той же причине, что и у хлебных крошек:
 * скрытый в разметке FAQ нарушает правила обоих поисковиков, а расходятся
 * такие пары всегда. Здесь оба вывода берутся из одного массива, и сделать
 * разметку без текста на странице физически нельзя.
 *
 * Почему `details`, а не аккордеон на состоянии: содержимое закрытого
 * `details` присутствует в HTML и доступно поисковику и скринридеру,
 * компоненту не нужен JavaScript, и он остаётся серверным.
 */
export const FaqSection: FC<Props> = ({
  items,
  title = 'Частые вопросы',
  className
}) => {
  const filled = items.filter(
    item => !!item.question?.trim() && !!item.answer?.trim()
  );

  if (!filled.length) {
    return null;
  }

  return (
    <section className={cn(className)}>
      <JsonLd data={buildFaqJsonLd(filled)!} />
      <SectionHeading>{title}</SectionHeading>
      <div className='border-rule divide-rule divide-y rounded-block border'>
        {filled.map(({ question, answer }) => (
          <details className='group px-3.5' key={question}>
            <summary className='font-caladea text-ink flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-[14.5px] font-bold'>
              {question}
              <span
                aria-hidden='true'
                className='text-gold-ink shrink-0 text-[15px] transition-transform group-open:rotate-45'
              >
                +
              </span>
            </summary>
            <p className='font-caladea text-ink-muted pb-3.5 text-[14px] leading-relaxed'>
              {answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
};
