import { FC } from 'react';

import { postServices } from '@/features/post/server';

import { PostView } from '@/views/post/server';

export const dynamic = 'force-static';

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
