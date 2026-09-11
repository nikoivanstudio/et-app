'use server';

import { cn } from '@bem-react/classname';
import { FC } from 'react';

import styles from '@/shared/assets/styles.module.scss';
import { optimizeContentImages } from '@/shared/lib/content-images';
import { legacyTextToHtml } from '@/shared/lib/legacy-text';
import { sanitizeArticleHtml } from '@/shared/lib/sanitize';

const cnTextContent = cn('TextContent');

type TextContentProps = {
  content: TrustedHTML;
  bold?: boolean;
  unstyled?: boolean;
  /** Текст из WordPress: переносы строк разобрать на абзацы и списки. */
  legacy?: boolean;
};

export const TextContent: FC<TextContentProps> = async ({
  content,
  bold,
  unstyled,
  legacy
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
    // Два шага, и порядок важен.
    //
    // MED-3: контент из БД (в том числе перенесённый из WordPress) сначала
    // очищается по allowlist — script, iframe, style и любые обработчики on*
    // удаляются.
    //
    // D2: затем картинки внутри текста переписываются на `/_next/image`
    // и получают размеры и отложенную загрузку. Именно в этом порядке:
    // санитайзер разбирает и пересобирает разметку, так что процессору
    // достаётся предсказуемый HTML, а его собственные атрибуты уже никто
    // не вырежет.
    dangerouslySetInnerHTML={{
      __html: optimizeContentImages(
        sanitizeArticleHtml(
          legacy ? legacyTextToHtml(String(content)) : String(content)
        )
      )
    }}
  ></div>
);
