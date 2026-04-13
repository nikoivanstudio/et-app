import { PhotoEntity } from '@/entities/photo/domain';

import {
  isNumber,
  isObject,
  isString,
  isStringArray
} from '@/shared/model/typeguards';

const isPhotoEntity = (value: unknown): value is PhotoEntity => {
  return (
    isObject(value) &&
    'id' in value &&
    isNumber(value.id) &&
    'title' in value &&
    isString(value.title) &&
    'keywords' in value &&
    isStringArray(value.keywords) &&
    'source' in value &&
    isString(value.source) &&
    'fileName' in value &&
    isString(value.fileName) &&
    'authorId' in value &&
    isNumber(value.authorId)
  );
};

export const photoTypeguards = { isPhotoEntity };
