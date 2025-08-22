/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
    }],
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/src/**/(*.)+(spec|test).(ts|tsx|js)',
  ],
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.d.ts',
  ],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
