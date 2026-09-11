'use server';

import { FC, ReactNode } from 'react';

import { AppMain } from '@/widgets/app-main/server';

import { SectionBody, SectionHead } from '@/entities/page-head/server';

import {
  hasRequisites,
  LEGAL_REVISION_DATE,
  REQUISITES
} from '@/shared/constants/legal-constants';
import type { Crumb } from '@/shared/lib/seo/breadcrumbs';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';

type Props = {
  title: string;
  kicker?: string;
  lead?: string;
  crumbs: Crumb[];
  children: ReactNode;
  /** Показать реквизиты и дату редакции в конце — у правовых документов. */
  withRevision?: boolean;
};

/**
 * Оболочка служебной страницы: «О нас», оферта, политика (E8).
 *
 * Одна на все три: различаются они текстом, а не устройством, и три
 * копии одной вёрстки разъехались бы к первой правке.
 */
export const LegalPage: FC<Props> = async ({
  title,
  kicker,
  lead,
  crumbs,
  children,
  withRevision
}) => (
  <AppMain
    mainHead={
      <SectionHead page='services' kicker={kicker} title={title} lead={lead} />
    }
    mainContent={
      <SectionBody className='pb-16'>
        <div className='mx-auto w-full max-w-[720px]'>
          <Breadcrumbs className='mb-5' items={crumbs} />
          <div className='et-post'>{children}</div>

          {withRevision && (
            <div className='border-rule mt-10 border-t pt-5'>
              <p className='font-oswald text-ink-faint text-[12.5px]'>
                Редакция от {LEGAL_REVISION_DATE}
              </p>

              {/* Блока нет, пока реквизиты не заполнены: печатать
                  «ИНН: ___» в документе, на который ссылаются
                  в претензиях, нельзя. */}
              {hasRequisites() && (
                <p className='font-caladea text-ink-muted mt-2 text-[13.5px] leading-relaxed'>
                  {REQUISITES.legalName}
                  {!!REQUISITES.inn && `, ИНН ${REQUISITES.inn}`}
                  {!!REQUISITES.ogrn && `, ОГРН ${REQUISITES.ogrn}`}
                  {!!REQUISITES.legalAddress && `, ${REQUISITES.legalAddress}`}
                </p>
              )}
            </div>
          )}
        </div>
      </SectionBody>
    }
    mainBottom={null}
  />
);
