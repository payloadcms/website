module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-base',
    require.resolve('./rules/typescript.js'),

    // this can be added back in, if we can figure out how
    // to make it only enforce on certain directories
    // require.resolve('./rules/filenames.js'),

    require.resolve('./rules/import.js'),
    require.resolve('./rules/prettier.js'),
    require.resolve('./rules/style.js'),
  ],
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  globals: {
    NodeJS: true,
  },
}
