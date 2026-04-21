'use server';

import { FC } from 'react';

import { fileUtils } from '@/entities/file/lib/file-utils';
import {
  FileGalleryProps,
  GallerySlide
} from '@/entities/file-gallery/domain';
import { ClientFileGallery } from '@/entities/file-gallery/ui/client-file-gallery';

const getSlideAlt = (originalName: string, index: number): string =>
  originalName.trim() || `Фотография ${index + 1}`;

export const ServerFileGallery: FC<FileGalleryProps> = async ({
  files,
  title,
  showAllLabel
}) => {
  const slides: GallerySlide[] = files.map((file, index) => ({
    id: file.id,
    src: fileUtils.getFileSource(file.filename),
    alt: getSlideAlt(file.originalName, index)
  }));

  if (!slides.length) {
    return null;
  }

  return (
    <ClientFileGallery
      slides={slides}
      title={title}
      showAllLabel={showAllLabel}
    />
  );
};
