/**
 * 'off' or 0 - turn the rule off
 * 'warn' or 1 - turn the rule on as a warning (doesn’t affect exit code)
 * 'error' or 2 - turn the rule on as an error (exit code will be 1)
 */

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  globals: {
    // Spotify WEB Playback SDK で読み込まれる
    Spotify: 'readonly',
  },
  extends: [
    /**
     * @typescript-eslint/eslint-plugin と @nuxtjs/eslint-config を拡張している
     * #129
     * .eslintignore に .nuxt/, dist/, static/, node_modules/ を記載する
     * fork-ts-checker-webpack-plugin が無限ループで死ぬ
     */
    '@nuxtjs/eslint-config-typescript',
    // eslint-plugin-vue を拡張している
    'plugin:nuxt/recommended',
    'airbnb-base',
  ],
  settings: {
    // @todo import/no-unresolved を off にしてるので不要？
    // import/no-unresolved の False Positive 検知対策
    'import/resolver': {
      node: {
        extensions: [
          '.ts',
          '.tsx',
          '.js',
          '.jsx',
          '.vue',
        ],
      },
      alias: {
        map: [
          ['~', './client'],
          ['@', './client'],
          ['~~', '.'],
          ['@@', '.'],
          ['typed-vuex', './types/typed-vuex/index.d.ts'],
        ],
        extensions: [
          '.ts',
          '.tsx',
          '.js',
          '.jsx',
          '.vue',
          '.json',
        ],
      },
    },
  },
  rules: {
    // import するときの拡張子の有無
    'import/extensions': [2, {
      js: 'never',
      ts: 'never',
      json: 'never',
      scss: 'never',
      // *.vue ファイルを ts として読み込むために拡張子必須
      vue: 'always',
      worker: 'always',
    }],
    // path は ts でチェックする
    'import/no-unresolved': 0,
    'require-await': 2,
    'no-console': process.env.NODE_ENV === 'production'
      ? [2, { allow: ['info', 'warn', 'error'] }]
      : [1, { allow: ['info', 'warn', 'error'] }],
    'no-debugger': process.env.NODE_ENV === 'production'
      ? 2
      : 1,
    // 空白行は2行まで
    'no-multiple-empty-lines': [2, { max: 2 }],
    // dependencies にないパッケージからの import を許容
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
