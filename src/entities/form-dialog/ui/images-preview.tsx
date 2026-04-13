'use client';

import { cn } from '@bem-react/classname';
import Image from 'next/image';
import { FC } from 'react';
import z from 'zod';

type Props = {
  files: File[];
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
];

const imagesSchema = z.array(
  z
    .instanceof(File)
    .refine((f: File) => ACCEPTED_IMAGE_TYPES.includes(f.type), {
      message: 'Только изображения (jpeg, png, webp, gif).'
    })
    .refine((f: File) => f.size <= MAX_FILE_SIZE, {
      message: `Файл слишком большой. Максимум ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    })
);

const cnImagesPreview = cn('ImagesPreview');

export const ImagesPreview: FC<Props> = ({ files }) => {
  const result = imagesSchema.safeParse(files);
  const previews =
    result.success && files.length
      ? files.map(file => ({
          url: URL.createObjectURL(file),
          name: file.name,
          width: 400,
          height: 400
        }))
      : [];

  return (
    <>
      {!!previews.length && (
        <div className={cnImagesPreview()}>
          {previews.map(({ url, name, ...rest }, idx) => (
            <Image src={url} alt={name} key={idx} {...rest} />
          ))}
        </div>
      )}
    </>
  );
};
