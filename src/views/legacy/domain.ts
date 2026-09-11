import type { StaticImageData } from 'next/image';

export type ServiceViewProps = {
  id: number;
  title: string;
  content: string;
  mainImage: string | StaticImageData | null;
  images: string[];
  /** Последний сегмент адреса — по нему берём разметку из SERVICE_DETAILS. */
  slug?: string;
};
