import { FC } from 'react';

import { postServices } from '@/features/post/server';

import { PostView } from '@/views/post/server';

// ISR: страница перегенерируется раз в сутки (скользящее окно 24h от
// последней регенерации, не привязано к конкретному времени суток).
export const revalidate = 86400;

export async function generateStaticParams() {
  const posts = await postServices.getPostsSlugs();

  return posts.map(post => ({
    slug: post.slug
  }));
}

const Page: FC<{
  params: Promise<{ slug: string }>;
}> = async ({ params }) => {
  const { slug } = await params;
  const either = await postServices.getPostBySlug(slug);

  return <PostView either={either} />;
};

export default Page;
