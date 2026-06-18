import { z } from 'zod';

export const routeStopSchema = z.object({
  title: z.string(),
  titleHref: z.string().optional(),
  sub: z.string().optional(),
  wikiHref: z.string().optional(),
  coordinates: z.string().optional()
});

export const ticketSchema = z.object({
  label: z.string(),
  hint: z.string().optional(),
  price: z.string().optional(),
  free: z.boolean().optional()
});

export const infoItemSchema = z.object({
  label: z.string(),
  value: z.string()
});

export const tourContentSchema = z.object({
  lead: z.string(),
  tags: z.array(z.string()),
  routeStops: z.array(routeStopSchema),
  priceLabel: z.string().optional(),
  priceValue: z.string().optional(),
  priceNote: z.string().optional(),
  vkUrl: z.string().optional(),
  tickets: z.array(ticketSchema),
  ticketsNote: z.string().optional(),
  info: z.array(infoItemSchema),
  awaitsParagraphs: z.array(z.string()),
  awaitsHighlightsTitle: z.string().optional(),
  awaitsHighlights: z.array(z.string())
});

export type RouteStop = z.infer<typeof routeStopSchema>;
export type Ticket = z.infer<typeof ticketSchema>;
export type InfoItem = z.infer<typeof infoItemSchema>;
export type TourContent = z.infer<typeof tourContentSchema>;

export const emptyTourContent: TourContent = {
  lead: '',
  tags: [],
  routeStops: [],
  priceLabel: 'ЦЕНА ЗА МАШИНУ',
  priceValue: '',
  priceNote: 'без учёта скидки',
  vkUrl: '',
  tickets: [],
  ticketsNote: '',
  info: [],
  awaitsParagraphs: [],
  awaitsHighlightsTitle: 'Коротко о впечатлениях',
  awaitsHighlights: []
};

export const isTourContent = (value: unknown): value is TourContent =>
  tourContentSchema.safeParse(value).success;

/**
 * Нормализует значение `content` из БД (jsonb) в TourContent.
 * Любые отсутствующие/битые поля заменяются дефолтами, чтобы рендер
 * никогда не падал на старых/частичных данных.
 */
export const toTourContent = (raw: unknown): TourContent => {
  const parsed = tourContentSchema.safeParse(raw);

  if (parsed.success) {
    return parsed.data;
  }

  const source = (raw ?? {}) as Record<string, unknown>;

  return {
    ...emptyTourContent,
    ...source,
    tags: Array.isArray(source.tags) ? (source.tags as string[]) : [],
    routeStops: Array.isArray(source.routeStops)
      ? (source.routeStops as unknown[]).filter(
          (stop): stop is RouteStop => routeStopSchema.safeParse(stop).success
        )
      : [],
    tickets: Array.isArray(source.tickets)
      ? (source.tickets as unknown[]).filter(
          (t): t is Ticket => ticketSchema.safeParse(t).success
        )
      : [],
    info: Array.isArray(source.info)
      ? (source.info as unknown[]).filter(
          (i): i is InfoItem => infoItemSchema.safeParse(i).success
        )
      : [],
    awaitsParagraphs: Array.isArray(source.awaitsParagraphs)
      ? (source.awaitsParagraphs as string[])
      : [],
    awaitsHighlights: Array.isArray(source.awaitsHighlights)
      ? (source.awaitsHighlights as string[])
      : [],
    lead: typeof source.lead === 'string' ? source.lead : ''
  };
};
