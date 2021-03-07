import type { Configuration } from 'webpack';
import { projectRoot, clientRoot } from './path';

export const webpack = (config: Configuration) => {
  // eslint-disable-next-line no-param-reassign
  config.resolve = config.resolve ?? { alias: {} };
  Object.assign(config.resolve.alias, {
    ...config.resolve.alias,
    '~': clientRoot(),
    '~~': projectRoot(),
    '@': projectRoot('packages/server'),
    shared: projectRoot('packages/shared'),
  });

  // worker-loader を読み込む
  // https://github.com/nuxt/nuxt.js/pull/3480#issuecomment-404150387
  // config.output = config.output ?? {};
  // config.output.globalObject = 'this';
  // if (isClient) {
  //   config.module.rules.push({
  //     test: /bundle\.worker\.js$/,
  //     loader: 'worker-loader',
  //     exclude: /node_modules/,
  //   });
  // }
};
