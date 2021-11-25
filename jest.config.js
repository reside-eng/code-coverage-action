module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverageFrom: ['src/**/*.ts'],
  modulePathIgnorePatterns: ['dist'],
  coverageThreshold: {
    global: {
      lines: 15,
      statements: 15,
    },
  },
};
