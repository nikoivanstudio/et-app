type AuthorEntity = {
  id: string;
  login: string;
  role: string;
};

export type fileTypes = {
  photo: ['jpg', 'jpeg', 'png', 'web3'];
  video: ['mp3', 'mov', 'avi'];
};

export type FileEntity<T extends AuthorEntity = AuthorEntity> = {
  id: number;
  bucket: string;
  filename: string;
  originalName: string;
  type: keyof fileTypes;
  createdAt: Date;
  updatedAt?: Date;
  size: number;
  authorId: number;
  author?: T;
};

export type ShortFileProp = {
  originalFileName: string;
  fileSize: number;
};

export type PresignedUrlProp = ShortFileProp & {
  url: string;
  fileNameInBucket: string;
};

export type FileProps = ShortFileProp & {
  id: number;
  isDeleting?: boolean;
};

export type CreateFileDTO<
  T extends Omit<FileEntity, 'id' | 'author'> = Omit<
    FileEntity,
    'id' | 'author'
  >
> = T;

export type UpdateFileDTO<
  T extends Omit<FileEntity, 'author'> = Omit<FileEntity, 'author'>
> = T;

export const MAX_FILE_SIZE_NEXTJS_ROUTE = 4;
export const MAX_FILE_SIZE_S3_ENDPOINT = 100;
export const FILE_NUMBER_LIMIT = 10;
