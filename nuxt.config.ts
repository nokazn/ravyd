import colors from 'vuetify/es5/util/colors';
import { Configuration } from '@nuxt/types';

const config: Configuration = {
  mode: 'universal',
  srcDir: './client/',
  rootDir: './',
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
    '~~/server/api/',
  ],
  plugins: [
    { src: '~/plugins/inject-dayjs' },
    { src: '~/plugins/inject-vuex' },
    { src: '~/plugins/axios' },
    { src: '~/plugins/spotify' },
    { src: '~/plugins/vuetify' },
    { src: '~/plugins/vuex-persist', mode: 'client' },
  ],
  router: {
    middleware: 'auth',
  },
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxt/typescript-build',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
  ],
  env: {
    BASE_URL: process.env.BASE_URL || 'http://127.0.0.1:3000',
    SPOTIFY_URL: process.env.SPOTIFY_URL || 'https://api.spotify.com/v1',
  },
  axios: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:3000',
    browserBaseURL: process.env.SPOTIFY_URL,
    progress: false,
    retry: 3,
    debug: process.env.NODE_ENV === 'development',
    headers: {
      Accept: 'application/json',
    },
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    icons: {
      iconfont: 'mdi',
    },
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  loading: { color: '#fff' },
  build: {
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
    // extend(webpackConfig) {},
  },
  typescript: {
    typeCheck: {
      eslint: true,
    },
  },
};

export default config;
