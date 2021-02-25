// Must be at first line
// eslint-disable-next-line import/order
import './pre-start';

import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import type { NuxtConfig } from '@nuxt/types';

import {
  APP_NAME,
  IS_DEVELOPMENT,
  CLIENT_ORIGIN,
  SERVER_ORIGIN,
  PORT,
} from './config/constants';
import {
  projectRoot,
  clientRoot,
  babelPresets,
  axios,
  https,
  proxy,
  vuetify,
  webpack,
} from './config';

const nuxtConfig: NuxtConfig = {
  ssr: true,
  rootDir: clientRoot(),
  srcDir: clientRoot(),
  telemetry: false,
  head: {
    titleTemplate: `%s - ${APP_NAME}`,
    title: APP_NAME,
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
      // .eslintrc.globals.Spotify を設定する必要がある
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
    '@nuxtjs/style-resources',
    '@nuxtjs/vuetify',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/pwa',
    'portal-vue/nuxt',
  ],
  env: {
    CLIENT_ORIGIN,
    SERVER_ORIGIN,
  },
  server: {
    port: PORT,
    https,
  },
  build: {
    babel: {
      presets: ({ isServer }) => babelPresets(isServer),
    },
    plugins: [
      // lodash から必要な関数だけ取り出す
      new LodashModuleReplacementPlugin(),
    ],
    extend: (config, { isServer }) => webpack(config, isServer),
  },
  plugins: [
    { src: '~/plugins/dayjs' },
    { src: '~/plugins/vuex' },
    { src: '~/plugins/router' },
    { src: '~/plugins/axios' },
    { src: '~/plugins/spotify' },
    { src: '~/plugins/server' },
    { src: '~/plugins/vuetify' },
    { src: '~/plugins/compositionApi' },
    { src: '~/plugins/vuex-persist', mode: 'client' },
    { src: '~/plugins/constant' },
    { src: '~/plugins/observable/confirm' },
    { src: '~/plugins/observable/header' },
    { src: '~/plugins/observable/keyboard' },
    { src: '~/plugins/observable/overlay' },
    { src: '~/plugins/observable/screen' },
    { src: '~/plugins/observable/toast' },
  ],
  router: {
    middleware: 'auth',
  },
  css: [
    clientRoot('/assets/global.scss'),
    'spinkit/spinkit.min.css',
  ],
  loading: { color: '#fff' },
  axios,
  proxy: {
    '/api': proxy,
  },
  stylelint: {
    configFile: projectRoot('.stylelintrc.js'),
    fix: true,
  },
  styleResources: {
    scss: [clientRoot('assets/variables.scss')],
  },
  typescript: {
    // type check & lint
    typeCheck: IS_DEVELOPMENT
      ? {
        eslint: {
          files: clientRoot('**/*.{ts,js,vue}'),
        },
      }
      : undefined,
  },
  vuetify,
};

export default nuxtConfig;
