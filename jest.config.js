module.exports = {
  root: '<rootDir>/src',
  preset: '@shelf/jest-mongodb',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts','!<rootDir>/src/main/**'],
  coverageDirectory: 'coverage',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  coverageProvider: 'v8',
  testEnvironment: 'node'
}
