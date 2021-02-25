import { PluginItem } from '@babel/core';

export const babelPresets = (isServer: boolean, options: Record<string, unknown> = {}): PluginItem[] => {
  const params = {
    loose: true,
    buildTarget: isServer ? 'server' : 'client',
    // core-js のバージョンの競合を防ぐ
    corejs: { version: 3 },
    targets: { node: 'current' },
  };

  return [
    [
      '@nuxt/babel-preset-app',
      { ...params, ...options },
    ],
  ];
};
