import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './'
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  modulePathIgnorePatterns: ['<rootDir>/tests/'],
  /**
   * `uuid` и `jose` поставляются только в виде ES-модулей, а node_modules
   * по умолчанию не проходит через трансформер. Без этого исключения
   * падает любой тест, который импортирует маршрут целиком, — например
   * проверка метаданных всех публичных страниц (H1): она поднимает
   * дерево компонентов сегмента, а оттуда тянется `shared/lib/string-utils`
   * с `uuid`.
   */
  transformIgnorePatterns: ['/node_modules/(?!(uuid|jose)/)'],
  testEnvironment: 'jsdom'
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
