export type UploadFileKind = 'image' | 'video' | 'document';

export type ShortFileDto = {
  originalFileName: string;
  size: number;
};

export type ShortUrlDto = ShortFileDto & {
  url: string;
  fileNameInBucket: string;
};

export type FileDto = ShortUrlDto & { file: File };

export type UploadFilePreviewItem = {
  id: string;
  file: File;
};
