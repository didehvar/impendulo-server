const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  globals: {
    tsConfig: 'tsconfig.test.json',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || [], {
    prefix: '<rootDir>/',
  }),
  modulePaths: ['<rootDir>/'],
  preset: 'ts-jest',
  testEnvironment: 'node',
};
