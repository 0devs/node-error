module.exports = require('@0devs/package/config/jest.config');

module.exports.collectCoverage = true;

module.exports.collectCoverageFrom = ['src/Zerror.ts'];

module.exports.moduleFileExtensions = [
  'ts',
  'tsx',
  'js',
];

module.exports.globals = {
  'ts-jest': {
    tsConfig: 'tsconfig.json',
    diagnostics: false,
  },
};

module.exports.testMatch = [
  '**/spec/**/*.spec.ts',
];

module.exports.transform = {
  '^.+\\.(ts|tsx)$': 'ts-jest',
};
