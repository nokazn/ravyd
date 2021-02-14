const baseJestConfig = require('../../jest.config');

module.exports = {
  ...baseJestConfig,
  globals: {
    ...baseJestConfig.globals,
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
