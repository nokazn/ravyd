const path = require('path');

/**
 * @param {string} p
 * @returns {string}
 */
const projectRoot = (p) => path.join(__dirname, p);

module.exports = {
  moduleNameMapper: {
    '^~/(.*)$': projectRoot('packages/client/$1'),
    '^~~/(.*)$': projectRoot('$1'),
    '^@/(.*)$': projectRoot('packages/server/$1'),
    '^shared/(.*)$': projectRoot('packages/shared/$1'),
    '^vue$': 'vue/dist/vue.common.js',
    '^.+\\.(scss|css)$': 'jest-transform-stub',
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '.*\\.vue$': 'vue-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    projectRoot('packages/client/**'),
  ],
  setupFiles: [
    '<rootDir>/packages/client/tests/jest.setup.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/packages/client/tests/testTasks.js',
  ],
  globals: {
    'vue-jest': {
      experimentalCSSCompile: true,
      resources: {
        scss: [
          projectRoot('packages/client/assets/variables.scss'),
          projectRoot('packages/client/assets/vuetify.scss'),
        ],
      },
    },
  },
};
