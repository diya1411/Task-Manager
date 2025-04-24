module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      isolatedModules: true,
      // Disable source maps completely to avoid issues
      tsconfig: {
        sourceMap: false
      }
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Completely disable source maps
  globals: {
    'ts-jest': {
      disableSourceMapSupport: true
    },
  },
  // Skip source-map-support module
  transformIgnorePatterns: [
    'node_modules/(?!(source-map-support)/)'
  ],
  testPathIgnorePatterns: ['/node_modules/'],
  // Increase timeout for tests
  testTimeout: 20000
};
