module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/$1',
    '^~/(.*)$': '<rootDir>/client/$1',
    '^@@/(.*)$': '<rootDir>/$1',
    '^~~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/components/**/*.vue', '<rootDir>/pages/**/*.vue'],
  setupFiles: ['<rootDir>/client/tests/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/client/tests/testSetup.js'],
  globals: {
    'vue-jest': {
      experimentalCSSCompile: true,
      // TODO
      resources: {
        scss: ['<rootDir>/client/assets/variables.scss'],
      },
    },
  },
};
