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
    environment: 'jsdom',
    setupFiles: './vitest.setup.tsx',
    globals: true,
    include: [
      'src/views/**/*.test.tsx',
      'src/app/**/*.test.tsx',
      'src/widgets/**/*.test.tsx',
      'src/features/**/*.test.tsx',
      'src/entities/**/*.test.tsx'
    ],
    css: false
  }
});
