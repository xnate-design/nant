const path = require('node:path');
const { pathExistsSync } = require('fs-extra')

const { resolve } = path;

const JEST_MEDIA_MOCK = resolve(__dirname, 'jest.media.mock.cjs')
const JEST_STYLE_MOCK = resolve(__dirname, 'jest.style.mock.cjs')


function getRootConfig() {
  const file = resolve(process.cwd(), 'jest.config.js')

  if (pathExistsSync(file)) {
    delete require.cache[require.resolve(file)]
    return require(file)
  }
  return {}
}

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageProvider: 'v8',
  clearMocks: true,
  collectCoverage: true,
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  moduleNameMapper: {
    // '^@/(.*)$': '<rootDir>/src/$1',
    // '^~/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less)$': JEST_STYLE_MOCK,
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': JEST_MEDIA_MOCK,
  },
  modulePathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/dist/'],


  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  ...getRootConfig(),
}
