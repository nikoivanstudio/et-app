import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://energy-tur.ru',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    }
  ];
}
