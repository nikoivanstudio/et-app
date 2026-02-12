import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'server-only': path.resolve(__dirname, './vitest.empty.ts'),
      'generated/prisma/client': path.resolve(__dirname, './vitest.empty.ts')
    }
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/app/api/**/*.test.ts'],
    css: false
  }
});
