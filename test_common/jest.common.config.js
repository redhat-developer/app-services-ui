const { jestModuleMapper } = require('../utils/tooling/aliasHelper');
const { resolve } = require('path');
const config = {
  rootDir: '.',
  clearMocks: true,
  testTimeout: 10000, // required for server tests, which take ~3 seconds to start
  preset: 'ts-jest/presets/js-with-ts',
  moduleNameMapper: {
    ...jestModuleMapper,
  },
  coverageReporters: ['json', 'text', 'lcov', 'json-summary'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  // TODO: Enable when we refactor and remove code that's not needed.
  // coverageThreshold: {
  //   global: {
  //     branches: 40,
  //     functions: 40,
  //     lines: 40,
  //     statements: 40,
  //   },
  //},
};

module.exports = config;
