const isProduction = process.env === 'production';

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true,
    'jest/globals': true,
  },
  globals: {
    // Spotify Web Playback SDK
    Spotify: 'readonly',
  },
  // .vue ファイルの template のパーサー
  parser: 'vue-eslint-parser',
  parserOptions: {
    // .vue ファイルの script と .ts ファイルのパーサー
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    // @typescript-eslint/eslint-plugin と @nuxtjs/eslint-config を拡張している
    // #129 .eslintignore を漏れなく記載しないと fork-ts-checker-webpack-plugin が無限ループで死ぬ
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/recommended',
    // eslint-plugin-vue を拡張している
    'plugin:nuxt/recommended',
    'airbnb-base',
  ],
  plugins: ['jest'],
  rules: {
    'no-console': isProduction ? [2, { allow: ['info', 'warn', 'error'] }] : [1, { allow: ['info', 'warn', 'error'] }],
    'no-debugger': isProduction ? 2 : 1,
    // 空白行は2行まで
    'no-multiple-empty-lines': [2, { max: 2 }],
    // ts でチェック
    'no-undef': 0,
    camelcase: 0,
    'lines-between-class-members': 0,
    'arrow-body-style': 0,

    /**
     * eslint-plugin-import
     */
    // import するときの拡張子の有無
    'import/extensions': [
      2,
      {
        js: 'never',
        ts: 'never',
        json: 'never',
        scss: 'never',
        // *.vue ファイルを ts として読み込むために拡張子必須
        vue: 'always',
        worker: 'always',
      },
    ],
    // ts でチェック
    'import/no-unresolved': 0,
    // dependencies, devDependencies にないパッケージからの import を許容
    'import/no-extraneous-dependencies': [0, { devDependencies: true }],
    // 'import/no-extraneous-dependencies': [1, { devDependencies: true }],
    'import/prefer-default-export': 0,

    /**
     * eslint と @typescript-eslint 競合を防ぐ
     */
    // typescript-eslint の no-use-before-define を有効にする
    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': 2,
    // typescript-eslint の no-unuserd-vars を有効にする
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 2,

    'vue/valid-v-slot': [2, { allowModifiers: true }],
  },
};
