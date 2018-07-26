const config = require('@0devs/package/config/jest.config');

// FIXME jest fails if true
config.collectCoverage = false;

config.transform = {
    "^.+\\.jsx?$": "<rootDir>/jest.preprocessor.js"
};

module.exports = config;
