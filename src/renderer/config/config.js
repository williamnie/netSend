const buildrc = require("../../../.buildrc.js");

export default {
  history: { type: 'hash' },
  outputPath: `../../dist/renderer`,
  publicPath: './',
  dva: {
    immer: true,
    hmr: false,
  },
  title: 'netSend',
  locale: {
    default: 'zh-CN',
    antd: false,
  },

  alias: buildrc.webpack.alias,
  ignoreMomentLocale: true,
  routes: [
    {
      path: '/',
      component: './index',
      title: 'netSend'
    },
  ],
};
