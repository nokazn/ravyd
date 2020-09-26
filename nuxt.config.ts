/* eslint-disable no-param-reassign */
import fs from 'fs';
import path from 'path';
import colors from 'vuetify/es5/util/colors';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import type { NuxtConfig } from '@nuxt/types';
import type { PluginItem } from '@babel/core';

const babelPresets = (isServer: boolean, options?: Record<string, unknown>): PluginItem[] => {
  const params = {
    loose: true,
    buildTarget: isServer ? 'server' : 'client',
    // corejs のバージョンの競合を防ぐ
    corejs: { version: 3 },
    targets: { node: 'current' },
  };

  return [
    [
      '@nuxt/babel-preset-app',
      options != null
        ? { ...params, ...options }
        : params,
    ],
  ];
};

const nuxtConfig: NuxtConfig = {
  ssr: true,
  srcDir: './client/',
  rootDir: './',
  telemetry: false,
  head: {
    titleTemplate: `%s - ${process.env.npm_package_name}`,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    script: [
      // eslintrc.globals.Spotify を設定する必要がある
      {
        src: 'https://sdk.scdn.co/spotify-player.js',
        body: true,
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxt/typescript-build',
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
    '@nuxtjs/vuetify',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'portal-vue/nuxt',
  ],
  env: {
    BASE_URL: process.env.BASE_URL || 'https://127.0.0.1:3000',
  },
  server: {
    https: process.env.NODE_ENV === 'development'
      ? {
        key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
      }
      : undefined,
  },
  build: {
    analyze: process.env.NODE_ENV === 'development',
    babel: {
      presets: ({ isServer }) => babelPresets(isServer),
    },
    plugins: [
      // lodash から必要な関数だけ取り出す
      new LodashModuleReplacementPlugin(),
    ],
    extend(config, { isServer, isClient }) {
      config.module = config.module ?? { rules: [] };

      // lodash から必要な関数だけ取り出す
      config.module.rules.push({
        // vue ファイルを js ファイルに変換してから適用させたい
        enforce: 'post',
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['lodash'],
            presets: babelPresets(isServer, { modules: false }),
          },
        },
        test: /\.(ts|js|vue)$/,
        exclude: /node_modules/,
      });

      // worker-loader を読み込む
      // https://github.com/nuxt/nuxt.js/pull/3480#issuecomment-404150387
      config.output = config.output ?? {};
      config.output.globalObject = 'this';
      if (isClient) {
        config.module.rules.push({
          test: /bundle\.worker\.js$/,
          loader: 'worker-loader',
          exclude: /node_modules/,
        });
      }
    },
  },
  serverMiddleware: [
    '~~/server/app/',
  ],
  plugins: [
    { src: '~/plugins/dayjs' },
    { src: '~/plugins/vuex' },
    { src: '~/plugins/axios' },
    { src: '~/plugins/spotify' },
    { src: '~/plugins/server' },
    { src: '~/plugins/vuetify' },
    { src: '~/plugins/vuex-persist', mode: 'client' },
    { src: '~/plugins/toast' },
    { src: '~/plugins/overlay' },
    { src: '~/plugins/observable/header' },
  ],
  router: {
    middleware: 'auth',
  },
  css: [
    './assets/global.scss',
  ],
  loading: { color: '#fff' },
  axios: {
    baseURL: process.env.BASE_URL,
    browserBaseURL: 'https://api.spotify.com/v1',
    progress: false,
    retry: true,
    debug: process.env.NODE_ENV === 'development',
    headers: {
      common: {
        Accept: 'application/json',
      },
    },
  },
  dotenv: {
    filename: process.env.NODE_ENV === 'production' ? './.env.prod' : './.env.dev',
  },
  stylelint: {
    configFile: './.stylelintrc.js',
    fix: true,
  },
  styleResources: {
    scss: ['~/assets/variables.scss'],
  },
  typescript: {
    // type-check & lint
    typeCheck: {
      eslint: {
        files: './client/**/*.{ts,js,vue}',
      },
    },
  },
  vuetify: {
    customVariables: ['~/assets/vuetify.scss'],
    treeShake: true,
    icons: {
      iconfont: 'mdi',
    },
    defaultAssets: {
      icons: false,
    },
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.lightBlue.base,
          warning: colors.amber.accent4,
          error: colors.red.darken3,
          success: colors.teal.lighten1,
          active: colors.cyan.accent2,
          'active-icon': colors.cyan.base,
          subtext: colors.grey.lighten1,
          inactive: colors.grey.darken1,
        },
      },
    },
  },
};

export default nuxtConfig;
