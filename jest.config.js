module.exports = {
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/packages/client/$1',
    '^~~/(.*)$': '<rootDir>/$1',
    '^@/(.*)$': '<rootDir>/packages/server/$1',
    '^shared/(.*)$': '<rootDir>/packages/shared/$1',
    '^vue$': 'vue/dist/vue.common.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '.*\\.vue$': 'vue-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/packages/client/components/**',
    '<rootDir>/packages/client/pages/**',
  ],
  setupFiles: [
    '<rootDir>/packages/client/tests/jest.setup.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/packages/client/tests/testSetup.js',
  ],
  globals: {
    'vue-jest': {
      experimentalCSSCompile: true,
      // TODO
      resources: {
        scss: ['<rootDir>/packages/client/assets/variables.scss'],
      },
    },
  },
};
