import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(scss|css)$': '<rootDir>/__mocks__/styleMock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
}

export default config
