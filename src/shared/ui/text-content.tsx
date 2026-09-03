'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import styles from '@/shared/assets/styles.module.scss';
import { sanitizeArticleHtml } from '@/shared/lib/sanitize';

const cnTextContent = cn('TextContent');

type TextContentProps = {
  content: TrustedHTML;
  bold?: boolean;
  unstyled?: boolean;
};

export const TextContent: FC<TextContentProps> = async ({
  content,
  bold,
  unstyled
}) => (
  <div
    className={cnTextContent(
      null,
      unstyled
        ? [
            'text-[#040404]',
            bold ? styles.caladea_text_bold : styles.text_caladea
          ]
        : [
            'p-5',
            'text-[#040404]',
            'border-2',
            'border-zinc-300',
            'rounded-xl',
            bold ? styles.caladea_text_bold : styles.text_caladea
          ]
    )}
    // MED-3: контент из БД (в том числе перенесённый из WordPress) очищается
    // по allowlist: script, iframe, style и любые обработчики on* удаляются
    dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(String(content)) }}
  ></div>
);
