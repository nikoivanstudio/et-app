import { ReviewDomain } from '@/entities/review';
import { Role } from '@/entities/user/domain';

// Роли, которые считаются «подтверждённым гидом» (создателем контента).
// Экспортируется массивом, а не только Set: тем же перечнем фильтруется
// выборка гидов для sitemap (`role: { in: GUIDE_ROLES }`).
export const GUIDE_ROLES: string[] = [
  Role.GUIDE,
  Role.SELLER,
  Role.ADMIN,
  Role.CONTRIBUTOR,
  Role.SUPER_ADMIN
];

const GUIDE_ROLES_SET = new Set<string>(GUIDE_ROLES);

export const isGuideRole = (role: string): boolean => GUIDE_ROLES_SET.has(role);

// Компактные данные гида для карточки на странице тура.
export type GuideSummary = {
  id: number;
  slug: string;
  displayName: string;
  headline?: string;
  avatarPhoto?: string;
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  toursCount: number;
};

export type GuideReviewItem = {
  id: number;
  content: string;
  estimation: ReviewDomain.Estimation;
  estimateValue: number;
  createdAt: string;
  authorName: string;
  authorAvatar?: string;
};

export type GuideTourCardItem = {
  id: number;
  slug: string;
  title: string;
  mainPhoto?: string;
  price: number;
  rating: number;
};

export type GuideProfile = GuideSummary & {
  bio?: string;
  coverPhoto?: string;
  languages: string[];
  specializations: string[];
  experienceYears?: number;
  experienceSince?: number;
  tours: GuideTourCardItem[];
  reviews: GuideReviewItem[];
};

export const buildDisplayName = (user: {
  firstName?: string | null;
  lastName?: string | null;
  login: string;
}): string => {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();

  return name || user.login;
};
