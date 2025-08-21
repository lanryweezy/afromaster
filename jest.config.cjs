module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom', 'whatwg-fetch'],
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\.(t|j)sx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
        },
        useESM: false,
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: {
                metaObjectReplacement: {
                  env: {
                    VITE_PAYSTACK_PUBLIC_KEY: 'pk_test_123',
                    VITE_GEMINI_API_KEY: 'test_gemini_key',
                    VITE_FIREBASE_API_KEY: 'test_firebase_api_key',
                    VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
                    VITE_FIREBASE_PROJECT_ID: 'test-project',
                    VITE_FIREBASE_STORAGE_BUCKET: 'test-project.appspot.com',
                    VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
                    VITE_FIREBASE_APP_ID: 'test_app_id',
                    VITE_FIREBASE_MEASUREMENT_ID: 'test_measurement_id',
                  },
                },
              },
            },
          ],
        },
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
  setupFiles: ['<rootDir>/test/setup.ts'],
};