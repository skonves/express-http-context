module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '!**/*.config.js',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/tests/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};
