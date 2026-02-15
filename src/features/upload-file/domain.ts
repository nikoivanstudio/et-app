export type UploadFileKind = 'image' | 'video' | 'document';

export type ShortFileDto = {
  originalFileName: string;
  size: number;
};

export type ShortUrlDto = ShortFileDto & {
  url: string;
  fileNameInBucket: string;
};

export type FullUrlDto = ShortUrlDto & {
  authorId: number;
  type: UploadFileKind;
};

export type FileDto = ShortUrlDto & { file: File };

export type UploadFilePreviewItem = {
  id: string;
  file: File;
};

export type HookConfig<E> = {
  onSuccess?: (value?: E) => (Promise<unknown> | unknown) | undefined;
  onError?: (value?: E) => (Promise<unknown> | unknown) | undefined;
  onSettled?: (value?: unknown) => void | Promise<void>;
};
