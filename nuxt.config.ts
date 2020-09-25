/* eslint-disable no-param-reassign */
import fs from 'fs';
import path from 'path';
import colors from 'vuetify/es5/util/colors';
import { NuxtConfig } from '@nuxt/types';

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
  css: [
    './assets/global.scss',
  ],
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
  env: {
    BASE_URL: process.env.BASE_URL || 'https://127.0.0.1:3000',
  },
  loading: { color: '#fff' },
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
    '@nuxtjs/style-resources',
    '@nuxtjs/stylelint-module',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'portal-vue/nuxt',
  ],
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
  styleResources: {
    scss: ['~/assets/variables.scss'],
  },
  stylelint: {
    configFile: './.stylelintrc.js',
    fix: true,
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
    analyze: true,
    babel: {
      presets({ isServer }) {
        return [
          // corejs のバージョンの競合を防ぐ
          [
            '@nuxt/babel-preset-app',
            {
              loose: true,
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 },
            },
          ],
        ];
      },
    },
    extend(config, { isDev, isClient }) {
      config.module = config.module ?? { rules: [] };

      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }

      // https://github.com/nuxt/nuxt.js/pull/3480#issuecomment-404150387
      config.output = config.output ?? {};
      config.output.globalObject = 'this';

      if (isClient) {
        config.module.rules.push({
          test: /bundle\.worker\.js$/,
          loader: 'worker-loader',
        });
      }
    },
  },
  typescript: {
    typeCheck: {
      eslint: {
        files: './client/**/*.{ts,js,vue}',
      },
    },
  },
};

export default nuxtConfig;
