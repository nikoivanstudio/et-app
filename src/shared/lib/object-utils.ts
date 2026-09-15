import { WithoutNull } from '@/shared/model/types';

type TObject = Record<string | number | symbol, unknown>;

function makeWithoutNull<T extends Record<string, unknown>>(
  obj: T
): WithoutNull<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null)
  ) as WithoutNull<T>;
}

export function removeEmptyProperties<T extends TObject>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => Boolean(v))
  ) as T;
}

export const objectUtils = { makeWithoutNull };
