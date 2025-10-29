const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',           
  testEnvironment: 'jsdom',   
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', 
  },
  testMatch: ['**/test/**/*.test.ts'], 
    setupFiles: ['dotenv/config', '<rootDir>/jest.setup.ts'],     
};
