import { TourDomain } from '@/entities/tour/server';
import { MetadataRoute } from 'next';
import { tourService } from '@/features/tour/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://energy-tur.ru';

  // Tours
  // const tours = await fetch(`${baseUrl}/api/tours`).then(res => res.json());
  const tours = await tourService.getTours();
  const tourUrls = tours.map((tour: TourDomain.TourEntity) => ({
    url: `${baseUrl}/tours/${tour.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7
  }));

  //

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1
    },
    ...tourUrls
  ];
}
