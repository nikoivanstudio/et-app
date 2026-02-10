import React from 'react';
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

type AppMainProps = {
  mainHead: React.ReactNode;
  mainContent: React.ReactNode;
  mainBottom: React.ReactNode;
} & Record<string, unknown>;

type PageHeadLayoutProps = {
  title: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  page?: string;
} & Record<string, unknown>;

type PageTitleProps = {
  topTitle?: { text: string };
  middleTitle?: { text: string };
} & Record<string, unknown>;

type ButtonProps = {
  children?: React.ReactNode;
  variant?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
} & Record<string, unknown>;

type TabsProps = {
  children?: React.ReactNode;
  className?: string;
  defaultValue?: string;
  orientation?: string;
};

const SimpleBox: React.FC<{ children?: React.ReactNode; testId: string }> = ({
  children,
  testId
}) => <div data-testid={testId}>{children}</div>;

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  )
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...rest
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}));

vi.mock('@/widgets/app-main/server', () => ({
  AppMain: ({ mainHead, mainContent, mainBottom }: AppMainProps) => (
    <div data-testid='app-main'>
      <div data-testid='app-main-head'>{mainHead}</div>
      <div data-testid='app-main-content'>{mainContent}</div>
      <div data-testid='app-main-bottom'>{mainBottom}</div>
    </div>
  )
}));

vi.mock('@/widgets/app-main/ui/app-main', () => ({
  AppMain: ({ mainHead, mainContent, mainBottom }: AppMainProps) => (
    <div data-testid='app-main'>
      <div data-testid='app-main-head'>{mainHead}</div>
      <div data-testid='app-main-content'>{mainContent}</div>
      <div data-testid='app-main-bottom'>{mainBottom}</div>
    </div>
  )
}));

vi.mock('@/entities/page-head/server', () => ({
  PageHeadLayout: ({ title, content }: PageHeadLayoutProps) => (
    <div data-testid='page-head-layout'>
      {title}
      {content}
    </div>
  ),
  PageHeadTour: (props: Record<string, unknown>) => (
    <div data-testid='page-head-tour'>{JSON.stringify(props)}</div>
  )
}));

vi.mock('@/entities/page-head/ui/page-head-layout', () => ({
  PageHeadLayout: ({ title, content }: PageHeadLayoutProps) => (
    <div data-testid='page-head-layout'>
      {title}
      {content}
    </div>
  )
}));

vi.mock('@/entities/page-title/server', () => ({
  PageTitle: ({ topTitle, middleTitle }: PageTitleProps) => (
    <div data-testid='page-title'>
      {topTitle?.text ?? ''}
      {middleTitle?.text ?? ''}
    </div>
  )
}));

vi.mock('@/entities/page-title/ui/page-title', () => ({
  PageTitle: ({ topTitle, middleTitle }: PageTitleProps) => (
    <div data-testid='page-title'>
      {topTitle?.text ?? ''}
      {middleTitle?.text ?? ''}
    </div>
  )
}));

vi.mock('@/widgets/tours/server', () => ({
  PopularTours: () => <SimpleBox testId='popular-tours' />,
  AllTours: () => <SimpleBox testId='all-tours' />
}));

vi.mock('@/widgets/activities/server', () => ({
  UpcomingActivities: () => <SimpleBox testId='upcoming-activities' />
}));

vi.mock('@/widgets/posts/containers/home-posts', () => ({
  HomePosts: () => <SimpleBox testId='home-posts' />
}));

vi.mock('@/widgets/posts/ui/server-post-card-list', () => ({
  ServerPostCardList: ({ list }: { list: unknown[] }) => (
    <div data-testid='post-card-list'>{list.length}</div>
  )
}));

vi.mock('@/widgets/app-header/containers/app-header', () => ({
  AppHeader: ({ variant }: { variant?: string }) => (
    <div data-testid='app-header'>{variant ?? ''}</div>
  )
}));

vi.mock('@/widgets/app-header/server', () => ({
  DashboardHeader: () => <div data-testid='dashboard-header' />
}));

vi.mock('@/widgets/contacts/containers/contacts-widget', () => ({
  ContactsWidget: () => <div data-testid='contacts-widget' />
}));

vi.mock('@/shared/ui/link-button', () => ({
  LinkButton: ({
    href,
    children
  }: {
    href: string;
    children?: React.ReactNode;
  }) => (
    <a data-testid='link-button' href={href}>
      {children}
    </a>
  )
}));

vi.mock('@/shared/ui/title', () => ({
  Title: ({
    children
  }: {
    children?: React.ReactNode;
    className?: string;
    type?: string;
  }) => <div data-testid='title'>{children}</div>
}));

vi.mock('@/shared/ui/legacy-tour-card', () => ({
  LegacyTourCard: ({ tour }: { tour: unknown }) => (
    <div data-testid='legacy-tour-card'>{JSON.stringify(tour)}</div>
  )
}));

vi.mock('@/shared/ui/server-slider', () => ({
  ServerSlider: ({
    title,
    slides
  }: {
    title: React.ReactNode;
    slides: React.ReactNode[];
    rounded?: boolean;
  }) => (
    <div data-testid='server-slider'>
      {title}
      {slides.map((slide, idx) => (
        <div data-testid='server-slide' key={idx}>
          {slide}
        </div>
      ))}
    </div>
  )
}));

vi.mock('@/shared/ui/text-content', () => ({
  TextContent: ({ content }: { content: unknown }) => (
    <div data-testid='text-content'>{String(content).slice(0, 20)}</div>
  )
}));

vi.mock('@/shared/ui/badge-price', () => ({
  BadgePrice: ({ price }: { price: string | number }) => (
    <div data-testid='badge-price'>{price}</div>
  )
}));

vi.mock('@/shared/ui/button', () => ({
  Button: ({ children, type }: ButtonProps) => (
    <button data-testid='button' type={type}>
      {children}
    </button>
  )
}));

vi.mock('@/shared/ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid='skeleton' className={className} />
  )
}));

vi.mock('@/shared/ui/tabs', () => ({
  Tabs: ({ children }: TabsProps) => <div data-testid='tabs'>{children}</div>,
  TabsList: ({ children }: TabsProps) => (
    <div data-testid='tabs-list'>{children}</div>
  ),
  TabsTrigger: ({ children }: TabsProps) => (
    <button data-testid='tabs-trigger'>{children}</button>
  ),
  TabsContent: ({ children }: TabsProps) => (
    <div data-testid='tabs-content'>{children}</div>
  )
}));

vi.mock('@/entities/mock-reviews-avatars', () => ({
  MockReviewsAvatars: ({ rating }: { rating: number }) => (
    <div data-testid='mock-reviews-avatars'>{rating}</div>
  )
}));

vi.mock('@/entities/duration/server', () => ({
  ServerDurationLabel: ({
    duration
  }: {
    duration: string | number;
    variant?: string;
    color?: string;
  }) => <div data-testid='duration-label'>{duration}</div>
}));

vi.mock('@/entities/duration/ui/server-duration-label', () => ({
  ServerDurationLabel: ({
    duration
  }: {
    duration: string | number;
    variant?: string;
  }) => <div data-testid='duration-label'>{duration}</div>
}));

vi.mock('@/widgets/photo-swiper/server', () => ({
  TourPhotoSwiper: ({ photos }: { photos: unknown }) => (
    <div data-testid='photo-swiper'>{JSON.stringify(photos)}</div>
  )
}));

vi.mock('@/features/dashboard', () => ({
  permissionsServices: {
    userHasPermissionsToDashboard: vi.fn(() => true)
  }
}));

vi.mock('@/entities/user/server', () => ({
  sessionService: {
    deleteSession: vi.fn(async () => undefined)
  },
  SessionDomain: {
    SessionEntity: {}
  }
}));
