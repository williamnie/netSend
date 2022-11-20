const buildrc = require("../../../.buildrc.js");
import path from 'path'
const { UMI_ENV } = process.env
console.log('-------', path.join(__dirname, '../../../node_modules'))
export default {
  history: { type: 'hash' },
  outputPath: `../../dist/renderer`,
  publicPath: UMI_ENV === 'dev' ? '/' : './',
  title: 'netSend',
  locale: {
    // 默认使用 src/locales/zh-CN.ts 作为多语言文件
    default: 'zh-CN',
    baseSeparator: '-',
  },
  antd: {
    // configProvider
    // configProvider: {},
    // themes
    // dark: true,
    // compact: true,
    // babel-plugin-import
    // import: true,
    // less or css, default less
    // style: 'less',
    // shortcut of `configProvider.theme`
  },
  mfsu: {
    cacheDirectory: path.join(__dirname, '../../../node_modules/.cache/mfsu')
  },
  request: {},
  styles: [`body {-webkit-app-region: drag;margin: 0 0;}`,],
  alias: buildrc.webpack.alias,
  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration'],
  },
  extraBabelPlugins: process.env.NODE_ENV === 'production'
    ? ['babel-plugin-dynamic-import-node']
    : [],
  routes: [
    {
      path: '/',
      component: './index',
      title: 'netSend'
    },
    {
      path: '/help',
      component: './help',
      title: 'netSend'
    },

  ],
  proxy: {
    '/api': {
      'target': 'http://127.0.0.1:23456/',
      'changeOrigin': true,
      // 'pathRewrite': { '^/api': '' },
    },
  },

};
