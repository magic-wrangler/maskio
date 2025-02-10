/**
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */

module.exports = {
  preset: 'ts-jest', // 使用 ts-jest 处理 TypeScript 文件
  testEnvironment: 'node', // 设置测试环境为 Node.js
  testPathIgnorePatterns: ['/node_modules/', '/dist/'], // 排除不需要测试的目录
  collectCoverage: true, // 启用代码覆盖率收集
  coverageDirectory: "coverage", // 指定覆盖率报告的输出目录
  coverageProvider: "v8", // 使用 V8 引擎收集覆盖率
  transform: {
    '^.+.tsx?$': 'ts-jest', // 将 .ts 和 .tsx 文件转换为可测试的格式
  }
}; 
