import {
  DOC_EXTENSIONS,
  DOC_MIME_TYPES,
  MAX_FILE_SIZE,
  MIN_IMAGE_SIZE
} from '../../constants/constants';

export const validateFile = (file: File) => {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isTypeAllowed =
    file.type.startsWith('image/') ||
    file.type.startsWith('video/') ||
    DOC_MIME_TYPES.includes(file.type) ||
    DOC_EXTENSIONS.includes(ext);

  return {
    isTooLarge: file.size > MAX_FILE_SIZE,
    isTooSmallImage: file.size < MIN_IMAGE_SIZE,
    isTypeInvalid: !isTypeAllowed
  };
};
