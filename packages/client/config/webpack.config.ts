import type { Configuration } from 'webpack';

import { babelPresets } from './babelPresets';
import { projectRoot, clientRoot } from './path';

export const webpack = (config: Configuration, isServer: boolean) => {
  // eslint-disable-next-line no-param-reassign
  config.module = config.module ?? { rules: [] };
  config.module.rules.push({
    // vue ファイルを js ファイルに変換してから適用させたい
    enforce: 'post',
    use: {
      // lodash から必要な関数だけ取り出す
      loader: 'babel-loader',
      options: {
        plugins: ['lodash'],
        presets: babelPresets(isServer, { modules: false }),
      },
    },
    test: /\.(ts|js|vue)$/,
    exclude: /node_modules/,
  });

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
