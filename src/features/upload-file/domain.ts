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

export type SaveFilesInfoResult = {
  type: 'left' | 'right';
  result: string;
};

export type HookConfig<E = Error> = {
  onSuccess?: (value: SaveFilesInfoResult['result']) => Promise<unknown> | unknown;
  onError?: (value: E) => Promise<unknown> | unknown;
  onSettled?: (
    value: SaveFilesInfoResult | undefined,
    error: E | null
  ) => void | Promise<void>;
};
