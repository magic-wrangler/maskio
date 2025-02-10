// 导入必要的 rollup 插件
import typescript from '@rollup/plugin-typescript' // 用于处理 TypeScript 文件
import resolve from '@rollup/plugin-node-resolve' // 用于解析 node_modules 中的依赖
// import terser from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts' // 用于生成 .d.ts 类型声明文件
import babel from 'rollup-plugin-babel' // 用于将现代 JavaScript (ES6+) 转换为向后兼容的版本
import pkg from './package.json' assert { type: 'json' }

// 导出 rollup 配置数组，包含两个构建任务
export default [
  {
    // 第一个任务：构建主要的 JavaScript 包
    input: 'src/index.ts', // 指定入口文件，从这里开始打包
    output: [
      {
        file: pkg.module,
        sourcemap: false,
        format: 'esm',
      },
      {
        file: pkg.main,
        sourcemap: false,
        format: 'cjs',
      },
      {
        file: pkg.umd, // 输出文件的路径和名称
        sourcemap: false, // 生成源码映射文件，在开发环境中便于调试原始代码
        name: 'maskio', // 指定在浏览器环境中的全局变量名，通过 window.maskio 访问
        format: 'umd', // 使用 UMD 格式打包，使其可以在浏览器、Node.js 和 AMD 加载器中使用
        amd: {
          // AMD 模块系统的配置（如 RequireJS）
          id: 'maskio' // 定义 AMD 模块的唯一标识符，用于模块加载时的引用
        }
      }
    ],
    plugins: [
      resolve(), // 解析第三方依赖，允许打包 node_modules 中的模块
      typescript(), // 编译 TypeScript 代码为 JavaScript
      babel({
        exclude: 'node_modules/**', // 排除 node_modules 目录下的文件，避免重复转换第三方库
        extensions: ['.js', '.ts'], // 指定需要 Babel 处理的文件扩展名
        // Babel 配置选项：
        // - 可以转换最新的 JavaScript 语法为兼容旧版本浏览器的代码
        // - 支持处理 .js 和 .ts 文件
        // - 通常与 .babelrc 或 babel.config.js 配合使用来指定具体的转换规则
      }),
      // terser({
        // // 压缩配置
        // compress: {
        //   drop_console: true, // 删除 console
        //   pure_funcs: ['console.log'], // 移除特定 console 函数
        //   passes: 2 // 压缩passes次数
        // },
        // format: {
        //   comments: false // 删除注释
        // }
      // })
    ]
  },
  {
    // 第二个任务：生成 TypeScript 类型声明文件
    input: 'src/index.ts', // 类型声明的入口文件
    output: [
      {
        file: 'lib/index.d.ts', // 类型声明文件的输出路径
        format: 'esm' // 使用 ES Module 格式，因为类型声明通常用于支持 TypeScript 的现代开发环境
      }
    ],
    plugins: [dts()] // 使用 dts 插件来提取和生成类型声明文件
  }
]
