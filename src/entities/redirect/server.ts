export {
  buildRedirectTarget,
  isRedirectStatusCode,
  normalizeRedirectSource
} from '@/entities/redirect/lib/redirect-utils';
export type { RedirectRule } from '@/entities/redirect/repositories/redirect';
export { redirectService } from '@/entities/redirect/services/redirect-service';
