import type { FileEntity } from '@/entities/file/domain';

export type GalleryFile = Pick<FileEntity, 'id' | 'filename' | 'originalName'>;

export type GallerySlide = {
  id: number;
  src: string;
  alt: string;
};

export type FileGalleryProps = {
  files: GalleryFile[];
  title?: string;
  showAllLabel?: string;
};
