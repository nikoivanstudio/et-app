import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/'
    },
    sitemap: 'https://okryme.ru/sitemap.xml'
  };
}

// export default function robots(): MetadataRoute.Robots {
//   return {
//     rules: [
//       {
//         userAgent: '*',
//         allow: '/',
//         disallow: ['/api', '/account', '/dashboard']
//       }
//     ],
//     sitemap: 'https://energy-tur.ru/sitemap.xml'
//   };
// }
