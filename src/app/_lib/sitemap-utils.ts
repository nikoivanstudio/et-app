const getSitemapItem = (
  url: string,
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
    | undefined
) => ({
  url,
  lastModified: new Date(2026, 1, 1),
  changeFrequency: changeFrequency || ('weekly' as const),
  priority: 0.7
});

export const sitemapUtils = { getSitemapItem };
