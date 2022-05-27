const merge = require("lodash.merge");
const { jestModuleMapper } = require("./utils/tooling/aliasHelper");
const { compilerOptions } = require("./tsconfig.json");
const commonConfig = require("./test_common/jest.common.config");

const config = {
  transformIgnorePatterns: ["node_modules/(?!byte-size)"],
  setupFilesAfterEnv: ["<rootDir>/test_common/jest_rtl_setup.ts"],
  roots: ["./src"],
  coverageDirectory: "<rootDir>/coverage",
  moduleNameMapper: {
    ...compilerOptions.paths,
    ...jestModuleMapper,
    "\\.(css|less)$":
      "<rootDir>/node_modules/@patternfly/react-styles/__mocks__/styleMock.js",
  },
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    "**/*.{js,ts,jsx,tsx}",
    "!**/index.{js,ts,jsx,tsx}",
    "!**/*.steps.*",
    "!**/*.d.ts",
    "!**/*types.ts",
    "!**/*.assets.{ts,tsx}",
    "!jest.config.js",
    "!**/mock/**/*",
  ],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
};

module.exports = merge({}, commonConfig, config);
