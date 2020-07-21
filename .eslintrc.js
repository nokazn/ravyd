module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  globals: {
    Spotify: 'readonly',
  },
  extends: [
    // @nuxtjs などを含む
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'airbnb-base',
  ],
  settings: {
    // import/no-unresolved の False Positive 検知対策
    'import/resolver': {
      node: {
        extensions: [
          '.ts',
          '.tsx',
          'js',
          'vue',
        ],
      },
    },
  },
  rules: {
    // import するときに拡張子を書かないもの
    'import/extensions': [2, {
      js: 'never',
      ts: 'never',
      json: 'never',
      scss: 'never',
      vue: 'always',
      worker: 'always',
    }],
    // @todo
    'import/no-unresolved': 0,
    'require-await': 2,
    'no-console': process.env.NODE_ENV === 'production'
      ? [1, { allow: ['warn', 'error'] }]
      : 0,
    'no-debugger': process.env.NODE_ENV === 'production'
      ? 2
      : 0,
    // 空白行は2行まで
    'no-multiple-empty-lines': [2, {
      max: 2,
    }],
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    // typescript-eslint の no-unuserd-vars を有効にする
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 2,
    camelcase: 0,
    'lines-between-class-members': 0,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
};
