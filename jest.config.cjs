module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom', 'whatwg-fetch'],
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\.(t|j)sx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        useESM: false,
      },
    ],
  },
  moduleNameMapper: {
    '^../src/firebaseConfig$': '<rootDir>/test/__mocks__/firebaseConfig.ts',
    '^../hooks/usePaystack$': '<rootDir>/test/__mocks__/usePaystack.ts',
    '\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^.+\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/test/__mocks__/fileMock.js',
  },
  testPathIgnorePatterns: ['/node_modules/'],
  transformIgnorePatterns: ['/node_modules/(?!.*(pages|components|services|src|hooks)/)'],
  globals: {
    'import.meta': {
      env: {
        VITE_PAYSTACK_PUBLIC_KEY: 'pk_test_123',
      },
    },
  },
};