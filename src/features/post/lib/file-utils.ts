import 'server-only';

import { Post } from '../../../../generated/prisma/client';

const getPostsFileJSONStream = (posts: Post[]): ReadableStream => {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode('[\n'));

      posts.forEach((post, index) => {
        const json = JSON.stringify(post, null, 2);
        const suffix = index < posts.length - 1 ? ',\n' : '\n';
        controller.enqueue(encoder.encode(json + suffix));
      });

      controller.enqueue(encoder.encode(']'));
      controller.close();
    }
  });

  return stream;
};

export const filesUtils = { getPostsFileJSONStream };
