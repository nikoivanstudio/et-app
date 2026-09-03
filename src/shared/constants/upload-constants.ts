/**
 * Allowlist загружаемых файлов (HIGH-6).
 *
 * SVG сознательно отсутствует: он может содержать тег script, а файлы отдаются
 * с домена приложения, поэтому такой скрипт исполнялся бы в контексте сайта
 * и получал доступ к сессии.
 */
export const ALLOWED_UPLOAD_EXTENSIONS = {
  image: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
  video: ['mp4', 'webm', 'mov'],
  document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt']
} as const;

export const ALL_ALLOWED_UPLOAD_EXTENSIONS: readonly string[] = Object.values(
  ALLOWED_UPLOAD_EXTENSIONS
).flat();

/** Максимальный размер по типу файла, в байтах. */
export const MAX_UPLOAD_SIZE_BYTES = {
  image: 15 * 1024 * 1024,
  video: 200 * 1024 * 1024,
  document: 25 * 1024 * 1024
} as const;

export const MAX_UPLOAD_SIZE_ANY = Math.max(
  ...Object.values(MAX_UPLOAD_SIZE_BYTES)
);

export type UploadFileKind = keyof typeof ALLOWED_UPLOAD_EXTENSIONS;

export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');

  return parts.length > 1 ? (parts.at(-1) || '').toLowerCase() : '';
};

export const getUploadKindByExtension = (
  extension: string
): UploadFileKind | null => {
  const entries = Object.entries(ALLOWED_UPLOAD_EXTENSIONS) as [
    UploadFileKind,
    readonly string[]
  ][];

  const entry = entries.find(([, extensions]) =>
    extensions.includes(extension)
  );

  return entry ? entry[0] : null;
};

 
const CONTROL_CHARS = new RegExp('[\\u0000-\\u001f\\u007f]');

/**
 * Имя объекта в бакете не должно уводить за пределы ожидаемого префикса
 * и не должно содержать управляющих символов.
 */
export const isSafeObjectName = (name: string): boolean =>
  name.length > 0 &&
  name.length <= 512 &&
  !name.startsWith('/') &&
  !name.includes('..') &&
  !CONTROL_CHARS.test(name);
