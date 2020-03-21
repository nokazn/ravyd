import { Configuration } from '@nuxt/types';
// @todo
// @ts-ignore
import colors from 'vuetify/es5/util/colors';

const config: Configuration = {
  mode: 'universal',
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
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  // Customize the progress-bar color
  loading: { color: '#fff' },
  // Global CSS
  css: [],
  // Plugins to load before mounting the App
  serverMiddleware: [
    '@@/api/auth/',
  ],
  plugins: [
    {
      src: '@/plugins/vuetify.ts',
      mode: 'server',
    }, {
      src: '@/plugins/vuex-persist',
      mode: 'client',
    },
  ],
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
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    clientId: process.env.SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
  },
  // Axios module configuration (https://axios.nuxtjs.org/options)
  axios: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
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
  // Build configuration
  build: {
    // You can extend webpack config here
    // extend(config, ctx) {},
  },
  typescript: {
    typeCheck: {
      eslint: true,
    },
  },
};

export default config;
