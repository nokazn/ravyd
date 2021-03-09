import colors from 'vuetify/es5/util/colors';
import type { Options } from '@nuxtjs/vuetify';

import { clientRoot } from './path';

export const vuetify: Options = {
  customVariables: [clientRoot('assets/vuetify.scss')],
  treeShake: true,
  icons: {
    iconfont: 'mdi',
    values: {},
  },
  defaultAssets: {
    icons: false,
  },
  theme: {
    dark: true,
    themes: {
      dark: {
        bg: '#1e2022',
        'bg-card': '2a2a2c',
        'bg-menu': '2e3032',
        'bg-footer': '343636',
        primary: colors.blue.darken2,
        secondary: colors.grey.darken3,
        accent: colors.amber.darken3,
        info: colors.lightBlue.base,
        warning: colors.amber.accent4,
        error: colors.red.darken3,
        success: colors.teal.lighten1,
        active: colors.cyan.accent2,
        'active-icon': colors.cyan.base,
        subtext: colors.grey.lighten1,
        inactive: colors.grey.darken1,
      },
      // TODO:
      // @ts-expect-error
      light: {},
    },
  },
};
