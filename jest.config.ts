import type { Config } from '@jest/types'
import { pathsToModuleNameMapper } from 'ts-jest'
import tsconfig from './tsconfig.json'

function manageKey (key: string): string {
  return key.includes('(.*)') ? key.slice(0, -1) + '\\.js$' : key
}

function manageMapper (mapper: Record<string, string>): Record<string, string> {
  const newMapper: Record<string, string> = {}
  for (const key in mapper) {
    newMapper[manageKey(key)] = mapper[key]
  }
  return newMapper
}

const config: Config.InitialOptions = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  verbose: true,
  coverageProvider: 'v8',
  moduleNameMapper: manageMapper(pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: '<rootDir>/src/' }) as Record<string, string>),
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**'
  ],
  coverageDirectory: 'coverage',
  extensionsToTreatAsEsm: ['.ts'],
  roots: [
    '<rootDir>/tests'
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      useESM: true
    }]
  }
}
export default config
