module.exports = {
  env: {
    // test 用
    test: {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
    },
  },
};
