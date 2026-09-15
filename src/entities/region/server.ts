export {
  DEFAULT_REGION_SLUG,
  REGIONS
} from '@/entities/region/constants/regions';
export {
  findRegion,
  findRegionByPath,
  getDefaultRegion,
  getPublishedRegions,
  getRegions,
  isRegionPublished,
  regionPath
} from '@/entities/region/lib/region-registry';
export type { Region } from '@/entities/region/model/types';
