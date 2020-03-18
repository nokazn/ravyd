module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
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
        ],
      },
    },
  },
  rules: {
    'vue/html-closing-bracket-newline': [2, {
      singleline: 'never',
      multiline: 'never',
    }],
    'import/extensions': [2, {
      js: 'never',
      ts: 'never',
      json: 'never',
      vue: 'never',
      scss: 'never',
    }],
    // 'import/no-unresolved': 0,
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
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
};
