// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from '/Users/xiaobei/Documents/private/toolbox/netSend/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": require('/Users/xiaobei/Documents/private/toolbox/netSend/src/renderer/pages/index').default,
    "title": "netSend",
    "exact": true
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
