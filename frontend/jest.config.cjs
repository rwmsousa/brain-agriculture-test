/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  globals: {
    'import.meta': { env: { VITE_API_URL: 'http://localhost:3001/api/v1' } },
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^(\\.\\.?/)*services/api$': '<rootDir>/src/__mocks__/api.ts',
    'services/api': '<rootDir>/src/__mocks__/api.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': '<rootDir>/src/__mocks__/importMetaEnvTransformer.cjs',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/main.tsx'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text', 'html'],
};

module.exports = config;
