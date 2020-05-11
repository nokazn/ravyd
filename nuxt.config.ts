import { Configuration } from '@nuxt/types';
import colors from 'vuetify/es5/util/colors';

const config: Configuration = {
  mode: 'universal',
  srcDir: './client/',
  rootDir: './',
  // Headers of the page
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
  // Customize the progress-bar color
  loading: { color: '#fff' },
  // Global CSS
  css: [
    './assets/global.scss',
  ],
  // Plugins to load before mounting the App
  serverMiddleware: [
    '~~/server/api/',
  ],
  plugins: [
    {
      src: '~/plugins/inject-dayjs',
    },
    {
      src: '~/plugins/inject-vuex',
    },
    {
      src: '~/plugins/axios',
    },
    {
      src: '~/plugins/vuetify',
    },
    {
      src: '~/plugins/vuex-persist',
      mode: 'client',
    },
  ],
  router: {
    middleware: 'auth',
  },
  // Nuxt.js dev-modules
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxt/typescript-build',
  ],
  // Nuxt.js modules
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
  ],
  env: {
    baseUrl: process.env.BASE_URL || 'http://127.0.0.1:3000',
    spotifyUrl: process.env.SPOTIFY_URL || 'https://api.spotify.com/v1',
  },
  // Axios module configuration (https://axios.nuxtjs.org/options)
  axios: {
    baseURL: process.env.baseUrl,
    browserBaseURL: process.env.SpotifyUrl,
    progress: false,
    retry: 3,
    debug: process.env.NODE_ENV === 'development',
    headers: {
      Accept: 'application/json',
    },
  },
  // vuetify module configuration (https://github.com/nuxt-community/vuetify-module)
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
  // webpack build configuration
  build: {
    babel: {
      presets() {
        return [
          ['@nuxt/babel-preset-app', { loose: true }],
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
