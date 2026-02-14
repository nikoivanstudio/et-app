import z from 'zod';

const shortFileDtoSchema = z.object({
  originalFileName: z
    .string({
      required_error: 'originalFileName является обязательным полем',
      invalid_type_error: 'originalFileName должен быть строкой'
    })
    .min(1, 'originalFileName не должен быть пустым'),
  size: z
    .number({
      required_error: 'size является обязательным полем',
      invalid_type_error: 'size должен быть числом'
    })
    .nonnegative('size must be >= 0')
});

const arrShortFileDtoSchema = z
  .array(shortFileDtoSchema, {
    required_error: 'data является обязательным полем',
    invalid_type_error: 'data должен быть  array'
  })
  .min(1, 'должно быть не менее одного наименования');

export const presignedUrlsDataSchema = z.object(
  {
    fileItems: arrShortFileDtoSchema
  },
  {
    required_error: 'body является обязательным полем',
    invalid_type_error: 'body должен быть объектом'
  }
);

export const urlDtoSchema = shortFileDtoSchema.extend({
  url: z
    .string({
      required_error: 'url является обязательным полем',
      invalid_type_error: 'url должен быть строкой'
    })
    .min(1, 'url не должен быть пустым'),
  fileNameInBucket: z.string({
    required_error: 'fileNameInBucket является обязательным полем',
    invalid_type_error: 'fileNameInBucket должен быть строкой'
  }),
  authorId: z.number({
    required_error: 'authorId является обязательным полем',
    invalid_type_error: 'authorId должен быть числом'
  }),
  type: z.enum(['image', 'video', 'document'], {
    required_error: 'Type является обязательным полем',
    invalid_type_error: 'Type может быть - image | video | document'
  })
});

export const saveFileInfoSchema = z.object(
  {
    filesInfo: z.array(urlDtoSchema)
  },
  {
    required_error: 'body является обязательным полем',
    invalid_type_error: 'body должен быть массивом информации о файлах'
  }
);
