// @ts-nocheck
import { plugin } from './plugin';
import * as Plugin_0 from '/Users/xiaobei/Documents/private/toolbox/netSend/src/renderer/app.js';
import * as Plugin_1 from '../plugin-initial-state/runtime';
import * as Plugin_2 from '/Users/xiaobei/Documents/private/toolbox/netSend/src/renderer/.umi-production/plugin-locale/runtime.tsx';
import * as Plugin_3 from '../plugin-model/runtime';

  plugin.register({
    apply: Plugin_0,
    path: '/Users/xiaobei/Documents/private/toolbox/netSend/src/renderer/app.js',
  });
  plugin.register({
    apply: Plugin_1,
    path: '../plugin-initial-state/runtime',
  });
  plugin.register({
    apply: Plugin_2,
    path: '/Users/xiaobei/Documents/private/toolbox/netSend/src/renderer/.umi-production/plugin-locale/runtime.tsx',
  });
  plugin.register({
    apply: Plugin_3,
    path: '../plugin-model/runtime',
  });
