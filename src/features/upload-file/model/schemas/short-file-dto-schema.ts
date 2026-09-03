import z from 'zod';

import {
  ALL_ALLOWED_UPLOAD_EXTENSIONS,
  getFileExtension,
  getUploadKindByExtension,
  isSafeObjectName,
  MAX_UPLOAD_SIZE_ANY,
  MAX_UPLOAD_SIZE_BYTES
} from '@/shared/constants/upload-constants';

// Zod 4 заменил `required_error`/`invalid_type_error` одним параметром `error`.
// Отличаем отсутствующее значение от значения неверного типа по `issue.input`.
const requiredOrType = (requiredMessage: string, typeMessage: string) => ({
  error: (issue: { input?: unknown }) =>
    issue.input === undefined ? requiredMessage : typeMessage
});

const shortFileDtoSchema = z.object({
  originalFileName: z
    .string(
      requiredOrType(
        'originalFileName является обязательным полем',
        'originalFileName должен быть строкой'
      )
    )
    .min(1, 'originalFileName не должен быть пустым'),
  size: z
    .number(
      requiredOrType(
        'size является обязательным полем',
        'size должен быть числом'
      )
    )
    .int('size должен быть целым числом')
    .positive('size должен быть больше 0')
    .max(
      MAX_UPLOAD_SIZE_ANY,
      `size превышает максимально допустимый размер ${MAX_UPLOAD_SIZE_ANY} байт`
    )
});

/**
 * Политика загрузки (HIGH-6).
 *
 * До исправления presigned-ссылка выдавалась на любое имя файла, а размер
 * принимался от клиента как справочное число. Это позволяло положить
 * в публичный бакет, например, .svg со скриптом: файл затем отдавался
 * с домена приложения и исполнялся в контексте сайта, получая доступ к сессии.
 */
type UploadCandidate = { originalFileName: string; size: number };

const applyUploadPolicy = <Schema extends z.ZodType<UploadCandidate>>(
  schema: Schema
) =>
  schema
    .refine(value => isSafeObjectName(value.originalFileName), {
      message: 'Недопустимое имя файла',
      path: ['originalFileName']
    })
    .refine(
      value =>
        ALL_ALLOWED_UPLOAD_EXTENSIONS.includes(
          getFileExtension(value.originalFileName)
        ),
      {
        message: `Недопустимый тип файла. Разрешены: ${ALL_ALLOWED_UPLOAD_EXTENSIONS.join(
          ', '
        )}`,
        path: ['originalFileName']
      }
    )
    .refine(
      value => {
        const kind = getUploadKindByExtension(
          getFileExtension(value.originalFileName)
        );

        return kind !== null && value.size <= MAX_UPLOAD_SIZE_BYTES[kind];
      },
      {
        message: 'Файл превышает максимальный размер для своего типа',
        path: ['size']
      }
    );

const validatedShortFileDtoSchema = applyUploadPolicy(shortFileDtoSchema);

const arrShortFileDtoSchema = z
  .array(
    validatedShortFileDtoSchema,
    requiredOrType(
      'data является обязательным полем',
      'data должен быть  array'
    )
  )
  .min(1, 'должно быть не менее одного наименования');

export const presignedUrlsDataSchema = z.object(
  {
    fileItems: arrShortFileDtoSchema
  },
  requiredOrType(
    'body является обязательным полем',
    'body должен быть объектом'
  )
);

const urlDtoObjectSchema = shortFileDtoSchema.extend({
  url: z
    .string(
      requiredOrType(
        'url является обязательным полем',
        'url должен быть строкой'
      )
    )
    .min(1, 'url не должен быть пустым'),
  fileNameInBucket: z
    .string(
      requiredOrType(
        'fileNameInBucket является обязательным полем',
        'fileNameInBucket должен быть строкой'
      )
    )
    .refine(isSafeObjectName, 'Недопустимое имя объекта в хранилище'),
  authorId: z.number(
    requiredOrType(
      'authorId является обязательным полем',
      'authorId должен быть числом'
    )
  ),
  type: z.enum(
    ['image', 'video', 'document'],
    requiredOrType(
      'Type является обязательным полем',
      'Type может быть - image | video | document'
    )
  )
});

// Та же политика применяется и при сохранении сведений о загруженном файле
export const urlDtoSchema = applyUploadPolicy(urlDtoObjectSchema);

export const saveFileInfoSchema = z.object(
  {
    filesInfo: z.array(urlDtoSchema)
  },
  requiredOrType(
    'body является обязательным полем',
    'body должен быть массивом информации о файлах'
  )
);
