const path = require('node:path');
const { resolve } = path;

const JEST_MEDIA_MOCK = resolve(__dirname, 'jest.media.mock.cjs')
const JEST_STYLE_MOCK = resolve(__dirname, 'jest.style.mock.cjs')


module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageProvider: 'v8',

  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  moduleNameMapper: {
    // '^@/(.*)$': '<rootDir>/src/$1',
    // '^~/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less)$': JEST_STYLE_MOCK,
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': JEST_MEDIA_MOCK,
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  modulePathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/dist/'],

  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest/dist',
  }

}
