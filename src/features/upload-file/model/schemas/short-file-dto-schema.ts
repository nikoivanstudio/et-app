import z from 'zod';

const shortFileDtoSchema = z.object({
  originalFileName: z
    .string({
      required_error: 'originalFileName is required',
      invalid_type_error: 'originalFileName must be a string'
    })
    .min(1, 'originalFileName must not be empty'),
  size: z
    .number({
      required_error: 'size is required',
      invalid_type_error: 'size must be a number'
    })
    .nonnegative('size must be >= 0')
});

const arrShortFileDtoSchema = z
  .array(shortFileDtoSchema, {
    required_error: 'data is required',
    invalid_type_error: 'data must be an array'
  })
  .min(1, 'data must contain at least 1 item');

export const presignedUrlsDataSchema = z.object(
  {
    fileItems: arrShortFileDtoSchema
  },
  {
    required_error: 'body is required',
    invalid_type_error: 'body must be an object'
  }
);
