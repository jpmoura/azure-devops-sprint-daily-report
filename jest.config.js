module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: { '^.+\\.ts?$': 'ts-jest' },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coverageDirectory: 'coverage',
  reporters: ['default', 'jest-sonar'],
  testRegex: '(/src/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
};
