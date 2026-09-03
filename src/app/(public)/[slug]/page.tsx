import { notFound } from 'next/navigation';
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

  // Поста с таким slug нет — это 404, а не ошибка загрузки: раньше страница
  // отдавала 200 и голую строку «Ошибка при загрузке страницы».
  if (either.type === 'left') {
    notFound();
  }

  return <PostView either={either} />;
};

export default Page;
